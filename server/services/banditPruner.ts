import { db } from "../db";
import {
  messageTemplateVariants,
  templateBanditStats,
  templateFlags,
  armLimits,
  type MessageTemplateVariant,
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export type Channel = 'wa' | 'email';

type BanditRow = {
  stage: string;
  templateId: string;
  shown: number;
  alpha: number;
  beta: number;
  reward: number;
};

type Summary = { ok: true; rows: BanditRow[] };

// Safety thresholds
const MIN_SHOWS_PER_STAGE = 120;
const MIN_SHOWS_PER_ARM = 25;
const DEFAULT_LIMIT = 3;

export class BanditPruner {
  /**
   * Get aggregated bandit statistics across all cohorts
   */
  async banditSummary(): Promise<Summary> {
    const result = await db.execute(sql`
      SELECT 
        t.stage,
        t.id as template_id,
        COALESCE(SUM(s.shown_count), 0)::integer AS shown,
        COALESCE(SUM(CAST(s.alpha AS DECIMAL)), 0)::numeric AS alpha,
        COALESCE(SUM(CAST(s.beta AS DECIMAL)), 0)::numeric AS beta,
        COALESCE(SUM(CAST(s.total_reward AS DECIMAL)), 0)::numeric AS reward
      FROM message_template_variants t
      LEFT JOIN template_bandit_stats s ON s.template_id = t.id
      GROUP BY t.stage, t.id
    `);

    const rows: BanditRow[] = (result.rows as any[]).map(r => ({
      stage: r.stage,
      templateId: r.template_id,
      shown: Number(r.shown || 0),
      alpha: Number(r.alpha || 0),
      beta: Number(r.beta || 0),
      reward: Number(r.reward || 0),
    }));

    return { ok: true, rows };
  }

  /**
   * Run auto-pruning across all stages and channels
   */
  async pruneOnce(): Promise<{ok: true; pruned: number; enabled: number}> {
    const sum = await this.banditSummary();
    const limits = await this.getLimitsMap();

    // Group by stage
    const byStage = new Map<string, BanditRow[]>();
    for (const r of sum.rows) {
      const arr = byStage.get(r.stage) || [];
      arr.push(r);
      byStage.set(r.stage, arr);
    }

    let pruned = 0;
    let enabled = 0;

    // Get active templates by channel
    const waActive = await this.listActiveTemplates('wa');
    const emActive = await this.listActiveTemplates('email');

    // Merge all stages
    const allStages = new Set<string>([
      ...Object.keys(waActive),
      ...Object.keys(emActive),
    ]);

    for (const stage of allStages) {
      // WhatsApp channel
      {
        const active = (waActive[stage] || []);
        const limit = limits.get(stage) ?? DEFAULT_LIMIT;
        const stats = byStage.get(stage) || [];
        const r = await this.pruneStage('wa', stage, limit, stats, active);
        pruned += r.pruned;
        enabled += r.enabled;
      }

      // Email channel
      {
        const active = (emActive[stage] || []);
        const limit = limits.get(stage) ?? DEFAULT_LIMIT;
        const stats = byStage.get(stage) || [];
        const r = await this.pruneStage('email', stage, limit, stats, active);
        pruned += r.pruned;
        enabled += r.enabled;
      }
    }

    console.log(`✂️  Auto-pruner complete: ${pruned} templates disabled, ${enabled} templates re-enabled`);
    return { ok: true, pruned, enabled };
  }

  /**
   * Audit channel for duplicate/similar templates using Jaccard similarity
   */
  async auditChannel(channel: Channel): Promise<Record<string, { ids: string[]; size: number }[]>> {
    const lib = await this.fetchLibrary(channel);
    const out: Record<string, { ids: string[]; size: number }[]> = {};
    const TH = 0.80; // 80% similarity threshold

    const byStage = new Map<string, { templateId: string; text: string; toks: Set<string> }[]>();
    for (const row of lib) {
      const arr = byStage.get(row.stage) || [];
      arr.push({
        templateId: row.templateId,
        text: row.sampleText,
        toks: tokens(row.sampleText)
      });
      byStage.set(row.stage, arr);
    }

    for (const [stage, arr] of byStage) {
      const used = new Set<string>();
      const clusters: { ids: string[]; size: number }[] = [];

      for (let i = 0; i < arr.length; i++) {
        if (used.has(arr[i].templateId)) continue;
        const group = [arr[i].templateId];

        for (let j = i + 1; j < arr.length; j++) {
          if (used.has(arr[j].templateId)) continue;
          const sim = jaccard(arr[i].toks, arr[j].toks);
          if (sim >= TH) {
            group.push(arr[j].templateId);
            used.add(arr[j].templateId);
          }
        }

        if (group.length > 1) {
          clusters.push({ ids: group, size: group.length });
        }
      }

      if (clusters.length) {
        out[stage] = clusters;
      }
    }

    return out;

    function norm(s: string) {
      return s.toLowerCase()
        .replace(/\{[^}]+\}/g, ' ') // Remove variables
        .replace(/[^a-z0-9\s]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function tokens(s: string) {
      return new Set(norm(s).split(' ').filter(Boolean));
    }

    function jaccard(A: Set<string>, B: Set<string>) {
      const inter = [...A].filter(x => B.has(x)).length;
      const uni = new Set([...A, ...B]).size;
      return uni ? inter / uni : 0;
    }
  }

  /**
   * Disable a template (mark as inactive)
   */
  async disableTemplate(channel: Channel, templateId: string, reason?: string) {
    await db
      .insert(templateFlags)
      .values({
        channel,
        templateId,
        disabled: true,
        reason: reason || null,
      })
      .onConflictDoUpdate({
        target: [templateFlags.channel, templateFlags.templateId],
        set: {
          disabled: true,
          reason: reason || null,
        },
      });
  }

  /**
   * Enable a template (mark as active)
   */
  async enableTemplate(channel: Channel, templateId: string) {
    await db
      .insert(templateFlags)
      .values({
        channel,
        templateId,
        disabled: false,
      })
      .onConflictDoUpdate({
        target: [templateFlags.channel, templateFlags.templateId],
        set: {
          disabled: false,
        },
      });
  }

  /**
   * Prune a single stage (disable weak arms, re-enable for exploration)
   */
  private async pruneStage(
    channel: Channel,
    stage: string,
    limit: number,
    statsRows: BanditRow[],
    activeIds: string[],
  ): Promise<{pruned: number; enabled: number}> {
    if (activeIds.length === 0) return { pruned: 0, enabled: 0 };

    const totalShows = statsRows.reduce((s, r) => s + (r.shown || 0), 0);

    let pruned = 0;
    let enabled = 0;

    // Over-cap → disable weakest arms (with safety guards)
    if (activeIds.length > limit && totalShows >= MIN_SHOWS_PER_STAGE) {
      const rows = activeIds.map(id => {
        const r = statsRows.find(x => x.templateId === id) || {
          shown: 0,
          alpha: 1,
          beta: 1,
          reward: 0
        };
        const mean = r.alpha > 0 && r.beta > 0 ? r.alpha / (r.alpha + r.beta) : 0.5;
        return { id, shown: r.shown, mean, reward: r.reward };
      });

      const eligible = rows.filter(r => r.shown >= MIN_SHOWS_PER_ARM);
      const pool = eligible.length ? eligible : rows;

      // Sort by performance (worst first)
      pool.sort((a, b) => (a.mean - b.mean) || (a.reward - b.reward) || (a.shown - b.shown));

      const toDisable = activeIds.length - limit;
      for (let i = 0; i < toDisable && i < pool.length; i++) {
        await this.disableTemplate(channel, pool[i].id, 'auto-pruner');
        pruned++;
      }
    }

    // Under-cap → re-enable a random disabled arm for exploration
    const stillActive = await this.listActiveTemplates(channel);
    const after = (stillActive[stage] || []);
    if (after.length < limit) {
      const backlog = await this.listDisabledTemplates(channel, stage);
      if (backlog.length) {
        const pickId = backlog[Math.floor(Math.random() * backlog.length)];
        await this.enableTemplate(channel, pickId);
        enabled++;
      }
    }

    return { pruned, enabled };
  }

  /**
   * Get stage limits from database
   */
  private async getLimitsMap(): Promise<Map<string, number>> {
    const limits = await db.select().from(armLimits);
    const m = new Map<string, number>();
    for (const r of limits) {
      m.set(r.stage, Number(r.limit || DEFAULT_LIMIT));
    }
    return m;
  }

  /**
   * List active templates by stage for a channel
   */
  private async listActiveTemplates(channel: Channel): Promise<Record<string, string[]>> {
    const result = await db.execute(sql`
      SELECT t.stage, t.id as template_id
      FROM message_template_variants t
      LEFT JOIN template_flags f
        ON f.channel = t.channel AND f.template_id = t.id
      WHERE t.channel = ${channel} 
        AND t.is_active = true
        AND COALESCE(f.disabled, FALSE) = FALSE
    `);

    const out: Record<string, string[]> = {};
    for (const r of result.rows as any[]) {
      (out[r.stage] ||= []).push(r.template_id);
    }
    return out;
  }

  /**
   * List disabled templates for a stage
   */
  private async listDisabledTemplates(channel: Channel, stage: string): Promise<string[]> {
    const result = await db.execute(sql`
      SELECT t.id as template_id
      FROM message_template_variants t
      JOIN template_flags f
        ON f.channel = t.channel AND f.template_id = t.id
      WHERE t.channel = ${channel}
        AND t.stage = ${stage}
        AND f.disabled = TRUE
    `);

    return (result.rows as any[]).map(r => r.template_id);
  }

  /**
   * Fetch template library for audit
   */
  private async fetchLibrary(channel: Channel): Promise<{
    stage: string;
    templateId: string;
    sampleText: string;
  }[]> {
    const templates = await db
      .select()
      .from(messageTemplateVariants)
      .where(eq(messageTemplateVariants.channel, channel));

    return templates.map(t => ({
      stage: t.stage,
      templateId: t.id,
      sampleText: t.textContent || '',
    }));
  }
}

export const banditPruner = new BanditPruner();
