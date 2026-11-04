// Profile Enrichment Service
// Consolidates insights from all sources and enriches lead profiles

import { storage } from "../storage";
import type { InsertLeadProfileInsight } from "@shared/schema";

interface EnrichmentResult {
  updatedFields: string[];
  appliedInsights: string[];
  skippedInsights: { id: string; reason: string; }[];
}

export class ProfileEnrichmentService {
  private readonly CONFIDENCE_THRESHOLD = 0.7;

  /**
   * Apply high-confidence insights to a lead profile
   */
  async enrichLeadProfile(leadId: string): Promise<EnrichmentResult> {
    const result: EnrichmentResult = {
      updatedFields: [],
      appliedInsights: [],
      skippedInsights: [],
    };

    try {
      // Get all unapplied insights for this lead
      const insights = await storage.getProfileInsightsByLead(leadId);
      const unappliedInsights = insights.filter(i => !i.appliedToProfile);

      if (unappliedInsights.length === 0) {
        return result;
      }

      // Get current lead data
      const lead = await storage.getLead(leadId);
      if (!lead) {
        throw new Error('Lead not found');
      }

      const updates: any = {};

      for (const insight of unappliedInsights) {
        const confidence = parseFloat(insight.confidence.toString());

        // Skip low-confidence insights
        if (confidence < this.CONFIDENCE_THRESHOLD) {
          result.skippedInsights.push({
            id: insight.id,
            reason: `Low confidence (${confidence.toFixed(2)})`,
          });
          continue;
        }

        // Apply insight based on type
        const applied = this.applyInsightToUpdates(insight, lead, updates);
        
        if (applied) {
          result.appliedInsights.push(insight.id);
          await storage.markInsightAsApplied(insight.id);
        } else {
          result.skippedInsights.push({
            id: insight.id,
            reason: 'Field already has more recent or reliable data',
          });
        }
      }

      // Apply all updates to lead
      if (Object.keys(updates).length > 0) {
        await storage.updateLead(leadId, updates);
        result.updatedFields = Object.keys(updates);
        
        // Track contact capture milestone if complete
        const { funnelTrackingService } = await import('./funnelTracking');
        const updatedLead = await storage.getLead(leadId);
        
        if (updatedLead && funnelTrackingService.isContactComplete(updatedLead)) {
          await funnelTrackingService.trackContactCaptured(leadId, {
            hasName: !!updatedLead.name,
            hasEmail: !!updatedLead.email,
            hasMobile: !!updatedLead.mobile,
            captureMethod: 'ai_extraction',
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Profile enrichment error:', error);
      throw error;
    }
  }

  /**
   * Apply a single insight to the updates object
   */
  private applyInsightToUpdates(
    insight: any,
    currentLead: any,
    updates: any
  ): boolean {
    const { insightType, insightValue } = insight;

    switch (insightType) {
      case 'budget':
        if (!currentLead.depositAmount && insightValue.max) {
          // Estimate deposit based on max weekly budget (typically 4 weeks rent)
          updates.depositAmount = insightValue.max * 4;
          return true;
        }
        break;

      case 'university':
        if (!currentLead.universityName) {
          updates.universityName = insightValue;
          return true;
        }
        break;

      case 'course':
        if (!currentLead.courseName) {
          updates.courseName = insightValue;
          return true;
        }
        break;

      case 'move_in_date':
        if (!currentLead.moveInDate && insightValue) {
          try {
            updates.moveInDate = new Date(insightValue);
            return true;
          } catch (e) {
            console.error('Invalid move-in date:', insightValue);
          }
        }
        break;

      case 'room_preference':
        if (insightValue && Array.isArray(insightValue)) {
          // Add to tags if not already present
          const currentTags = currentLead.tags || [];
          const newTags = [...currentTags];
          let added = false;

          for (const pref of insightValue) {
            if (!newTags.includes(pref)) {
              newTags.push(pref);
              added = true;
            }
          }

          if (added) {
            updates.tags = newTags;
            return true;
          }
        }
        break;

      case 'nationality':
        // Map to homeCountry if not set
        if (!currentLead.homeCountry && insightValue) {
          updates.homeCountry = insightValue;
          return true;
        }
        break;

      case 'home_country':
        if (!currentLead.homeCountry && insightValue) {
          updates.homeCountry = insightValue;
          return true;
        }
        break;

      case 'age_range':
      case 'age':
        if (!currentLead.ageRange && insightValue) {
          updates.ageRange = insightValue;
          return true;
        }
        break;

      case 'gender':
        if (!currentLead.gender && insightValue) {
          updates.gender = insightValue;
          return true;
        }
        break;

      case 'visa_status':
        if (!currentLead.visaStatus && insightValue) {
          updates.visaStatus = insightValue;
          return true;
        }
        break;

      case 'english_proficiency':
        if (!currentLead.englishProficiency && insightValue) {
          updates.englishProficiency = insightValue;
          return true;
        }
        break;

      case 'year_of_study':
        if (!currentLead.yearOfStudy && insightValue) {
          updates.yearOfStudy = insightValue;
          return true;
        }
        break;

      case 'pain_points':
        if (insightValue && Array.isArray(insightValue)) {
          const currentPainPoints = currentLead.painPoints || [];
          const newPainPoints = [...currentPainPoints];
          let added = false;

          for (const point of insightValue) {
            if (!newPainPoints.includes(point)) {
              newPainPoints.push(point);
              added = true;
            }
          }

          if (added) {
            updates.painPoints = newPainPoints;
            return true;
          }
        }
        break;

      case 'parent_involved':
        if (insightValue === true && !currentLead.parentInvolved) {
          updates.parentInvolved = true;
          return true;
        }
        break;

      case 'decision_timeline':
        if (!currentLead.decisionTimeline && insightValue) {
          updates.decisionTimeline = insightValue;
          return true;
        }
        break;

      case 'referral_source':
        if (!currentLead.referralSource && insightValue) {
          updates.referralSource = insightValue;
          return true;
        }
        break;

      case 'marketing_persona':
        if (!currentLead.marketingPersona && insightValue) {
          updates.marketingPersona = insightValue;
          return true;
        }
        break;

      default:
        // Unknown insight type - add to notes for manual review
        if (!currentLead.notes?.includes(insightType)) {
          const currentNotes = currentLead.notes || '';
          updates.notes = currentNotes
            ? `${currentNotes}\n${insightType}: ${JSON.stringify(insightValue)}`
            : `${insightType}: ${JSON.stringify(insightValue)}`;
          return true;
        }
    }

    return false;
  }

  /**
   * Save insights from call analysis
   */
  async saveCallInsights(
    leadId: string,
    callLogId: string,
    profileInsights: any[]
  ): Promise<string[]> {
    const savedInsightIds: string[] = [];

    for (const insight of profileInsights) {
      try {
        const newInsight: InsertLeadProfileInsight = {
          leadId,
          callLogId,
          source: 'call',
          insightType: insight.insightType,
          insightValue: insight.insightValue,
          confidence: insight.confidence.toString(),
          appliedToProfile: false,
        };

        const saved = await storage.saveProfileInsight(newInsight);
        savedInsightIds.push(saved.id);
      } catch (error) {
        console.error('Error saving insight:', error);
      }
    }

    return savedInsightIds;
  }

  /**
   * Get enrichment summary for a lead
   */
  async getEnrichmentSummary(leadId: string): Promise<{
    totalInsights: number;
    appliedInsights: number;
    pendingInsights: number;
    sources: { source: string; count: number; }[];
    profileCompleteness: number;
  }> {
    const insights = await storage.getProfileInsightsByLead(leadId);
    const lead = await storage.getLead(leadId);

    if (!lead) {
      return {
        totalInsights: 0,
        appliedInsights: 0,
        pendingInsights: 0,
        sources: [],
        profileCompleteness: 0,
      };
    }

    // Count insights by source
    const sourceCounts = new Map<string, number>();
    for (const insight of insights) {
      sourceCounts.set(insight.source, (sourceCounts.get(insight.source) || 0) + 1);
    }

    const sources = Array.from(sourceCounts.entries()).map(([source, count]) => ({
      source,
      count,
    }));

    // Calculate profile completeness (including new demographic fields)
    const fields = [
      'name', 'email', 'phone', 'universityName', 'courseName', 
      'moveInDate', 'depositAmount', 'propertyId', 'roomId',
      'homeCountry', 'ageRange', 'yearOfStudy', 'visaStatus'
    ];
    const filledFields = fields.filter(field => lead[field as keyof typeof lead]);
    const profileCompleteness = Math.round((filledFields.length / fields.length) * 100);

    return {
      totalInsights: insights.length,
      appliedInsights: insights.filter(i => i.appliedToProfile).length,
      pendingInsights: insights.filter(i => !i.appliedToProfile).length,
      sources,
      profileCompleteness,
    };
  }
}

export const profileEnrichmentService = new ProfileEnrichmentService();
