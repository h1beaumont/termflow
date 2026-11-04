import { Router } from 'express';
import { banditPruner } from '../services/banditPruner';
import { db } from '../db';
import { messageTemplateVariants, templateFlags, armLimits } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';

export const banditAdminRoutes = Router();

/**
 * GET /api/bandit/templates
 * List all templates with their disabled status
 */
banditAdminRoutes.get('/templates', async (_req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT 
        t.id,
        t.template_key,
        t.channel,
        t.stage,
        t.tone_or_subject,
        t.is_active,
        COALESCE(f.disabled, FALSE) AS disabled,
        f.reason
      FROM message_template_variants t
      LEFT JOIN template_flags f
        ON f.channel = t.channel AND f.template_id = t.id
      ORDER BY t.channel, t.stage, t.template_key
    `);

    res.json({ ok: true, items: result.rows });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch templates' });
  }
});

/**
 * POST /api/bandit/templates/disable
 * Disable a specific template
 */
banditAdminRoutes.post('/templates/disable', async (req, res) => {
  try {
    const { channel, templateId, reason } = req.body;

    if (!channel || !templateId) {
      return res.status(400).json({ ok: false, error: 'channel and templateId required' });
    }

    await banditPruner.disableTemplate(channel, templateId, reason);
    res.json({ ok: true, message: `Template ${templateId} disabled` });
  } catch (error) {
    console.error('Error disabling template:', error);
    res.status(500).json({ ok: false, error: 'Failed to disable template' });
  }
});

/**
 * POST /api/bandit/templates/enable
 * Enable a specific template
 */
banditAdminRoutes.post('/templates/enable', async (req, res) => {
  try {
    const { channel, templateId } = req.body;

    if (!channel || !templateId) {
      return res.status(400).json({ ok: false, error: 'channel and templateId required' });
    }

    await banditPruner.enableTemplate(channel, templateId);
    res.json({ ok: true, message: `Template ${templateId} enabled` });
  } catch (error) {
    console.error('Error enabling template:', error);
    res.status(500).json({ ok: false, error: 'Failed to enable template' });
  }
});

/**
 * POST /api/bandit/prune
 * Manually trigger auto-pruning
 */
banditAdminRoutes.post('/prune', async (_req, res) => {
  try {
    const result = await banditPruner.pruneOnce();
    res.json(result);
  } catch (error) {
    console.error('Error running pruner:', error);
    res.status(500).json({ ok: false, error: 'Failed to run pruner' });
  }
});

/**
 * GET /api/bandit/audit/:channel
 * Audit channel for duplicate templates
 */
banditAdminRoutes.get('/audit/:channel', async (req, res) => {
  try {
    const channel = req.params.channel === 'email' ? 'email' : 'wa';
    const clusters = await banditPruner.auditChannel(channel);
    res.json({ ok: true, channel, clusters });
  } catch (error) {
    console.error('Error auditing channel:', error);
    res.status(500).json({ ok: false, error: 'Failed to audit channel' });
  }
});

/**
 * POST /api/bandit/audit/:channel/prune
 * Auto-disable duplicates (keep best performer in each cluster)
 */
banditAdminRoutes.post('/audit/:channel/prune', async (req, res) => {
  try {
    const channel = req.params.channel === 'email' ? 'email' : 'wa';
    
    // Get bandit summary and clusters
    const sum = await banditPruner.banditSummary();
    const byVar = new Map(sum.rows.map(r => [r.templateId, r]));
    const clusters = await banditPruner.auditChannel(channel);
    
    let pruned = 0;

    for (const stage of Object.keys(clusters)) {
      for (const cluster of clusters[stage]) {
        // Find best performer in cluster
        let best = null as null | { id: string; mean: number; shown: number };
        
        for (const id of cluster.ids) {
          const r = byVar.get(id) || {
            alpha: 1,
            beta: 1,
            shown: 0,
            reward: 0,
            stage,
            templateId: id
          };
          const mean = r.alpha > 0 && r.beta > 0 ? r.alpha / (r.alpha + r.beta) : 0.5;
          
          if (!best || (mean > best.mean) || (mean === best.mean && r.shown > best.shown)) {
            best = { id, mean, shown: r.shown };
          }
        }
        
        // Disable all except best
        for (const id of cluster.ids) {
          if (id !== best!.id) {
            await banditPruner.disableTemplate(channel, id, 'duplicate-pruned');
            pruned++;
          }
        }
      }
    }

    res.json({ ok: true, pruned });
  } catch (error) {
    console.error('Error pruning duplicates:', error);
    res.status(500).json({ ok: false, error: 'Failed to prune duplicates' });
  }
});

/**
 * GET /api/bandit/summary
 * Get bandit performance summary
 */
banditAdminRoutes.get('/summary', async (_req, res) => {
  try {
    const summary = await banditPruner.banditSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error getting bandit summary:', error);
    res.status(500).json({ ok: false, error: 'Failed to get summary' });
  }
});

/**
 * GET /api/bandit/limits
 * Get arm limits for all stages
 */
banditAdminRoutes.get('/limits', async (_req, res) => {
  try {
    const limits = await db.select().from(armLimits);
    res.json({ ok: true, limits });
  } catch (error) {
    console.error('Error fetching limits:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch limits' });
  }
});

/**
 * POST /api/bandit/limits
 * Update arm limit for a stage
 */
banditAdminRoutes.post('/limits', async (req, res) => {
  try {
    const { stage, limit } = req.body;

    if (!stage || !limit || limit < 1) {
      return res.status(400).json({ ok: false, error: 'stage and limit (>= 1) required' });
    }

    await db
      .insert(armLimits)
      .values({ stage, limit })
      .onConflictDoUpdate({
        target: armLimits.stage,
        set: { limit, updatedAt: new Date() },
      });

    res.json({ ok: true, message: `Limit for ${stage} set to ${limit}` });
  } catch (error) {
    console.error('Error updating limit:', error);
    res.status(500).json({ ok: false, error: 'Failed to update limit' });
  }
});
