// Rapport Quality Scoring Service
// Measures conversation quality trade-offs: warmth vs efficiency

import { storage } from "../storage";

interface RapportScore {
  overallScore: number; // 0-100
  averageMessageLength: number;
  emojiCount: number;
  emojiDensity: number; // emojis per 100 characters
  averageResponseTimeSeconds: number;
  totalMessages: number;
  qualityCategory: "High Rapport" | "Balanced" | "Efficient";
}

export class RapportScoringService {
  /**
   * Calculate rapport quality score for a lead's conversation
   */
  async calculateRapportScore(leadId: string): Promise<RapportScore | null> {
    try {
      // Get conversation for this lead
      const conversation = await storage.getConversationByLead(leadId);
      if (!conversation) {
        return null;
      }

      // Get all messages
      const messages = await storage.getMessagesByConversation(conversation.id);
      const assistantMessages = messages.filter(m => m.role === 'assistant');

      if (assistantMessages.length === 0) {
        return null;
      }

      // Calculate metrics
      const totalMessages = assistantMessages.length;
      
      // 1. Average message length
      const totalChars = assistantMessages.reduce((sum, m) => sum + m.content.length, 0);
      const averageMessageLength = Math.round(totalChars / totalMessages);

      // 2. Emoji analysis
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
      let totalEmojis = 0;
      
      for (const msg of assistantMessages) {
        const emojis = msg.content.match(emojiRegex);
        if (emojis) {
          totalEmojis += emojis.length;
        }
      }
      
      const emojiDensity = totalChars > 0 ? (totalEmojis / totalChars) * 100 : 0;

      // 3. Response time analysis (time between user message and assistant response)
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      const responseTimes: number[] = [];
      for (let i = 1; i < sortedMessages.length; i++) {
        const prev = sortedMessages[i - 1];
        const curr = sortedMessages[i];
        
        if (prev.role === 'user' && curr.role === 'assistant') {
          const responseTime = (new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime()) / 1000;
          responseTimes.push(responseTime);
        }
      }
      
      const averageResponseTimeSeconds = responseTimes.length > 0
        ? Math.round(responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length)
        : 0;

      // Calculate overall rapport score (0-100)
      let score = 0;

      // Message length score (40 points max)
      // Longer messages (150+ chars) indicate more rapport-building
      const lengthScore = Math.min((averageMessageLength / 150) * 40, 40);
      score += lengthScore;

      // Emoji score (30 points max)
      // More emojis (0.5+ per 100 chars) indicate warmer tone
      const emojiScore = Math.min((emojiDensity / 0.5) * 30, 30);
      score += emojiScore;

      // Response time score (30 points max)
      // Faster responses (< 3 seconds) indicate engagement
      // But instant responses (< 1 second) might feel robotic
      let responseScore = 0;
      if (averageResponseTimeSeconds >= 1 && averageResponseTimeSeconds <= 3) {
        responseScore = 30;
      } else if (averageResponseTimeSeconds < 1) {
        responseScore = 20; // Slight penalty for too fast
      } else if (averageResponseTimeSeconds <= 5) {
        responseScore = 25;
      } else {
        responseScore = Math.max(30 - (averageResponseTimeSeconds - 5) * 2, 0);
      }
      score += responseScore;

      // Determine quality category
      let qualityCategory: "High Rapport" | "Balanced" | "Efficient";
      if (score >= 70) {
        qualityCategory = "High Rapport";
      } else if (score >= 40) {
        qualityCategory = "Balanced";
      } else {
        qualityCategory = "Efficient";
      }

      return {
        overallScore: Math.round(score),
        averageMessageLength,
        emojiCount: totalEmojis,
        emojiDensity: parseFloat(emojiDensity.toFixed(2)),
        averageResponseTimeSeconds,
        totalMessages,
        qualityCategory,
      };
    } catch (error) {
      console.error(`Error calculating rapport score for lead ${leadId}:`, error);
      return null;
    }
  }

  /**
   * Get rapport scores for all leads with a specific strategy
   */
  async getStrategyRapportAnalysis(strategyId: string): Promise<{
    strategyId: string;
    averageRapportScore: number;
    totalLeadsAnalyzed: number;
    distributionByCategory: Record<string, number>;
  }> {
    const assignments = await storage.getAssignmentsByStrategy(strategyId);
    const scores: RapportScore[] = [];

    for (const assignment of assignments) {
      const score = await this.calculateRapportScore(assignment.leadId);
      if (score) {
        scores.push(score);
      }
    }

    if (scores.length === 0) {
      return {
        strategyId,
        averageRapportScore: 0,
        totalLeadsAnalyzed: 0,
        distributionByCategory: {},
      };
    }

    const averageRapportScore = Math.round(
      scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length
    );

    const distributionByCategory = scores.reduce((acc, score) => {
      acc[score.qualityCategory] = (acc[score.qualityCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      strategyId,
      averageRapportScore,
      totalLeadsAnalyzed: scores.length,
      distributionByCategory,
    };
  }
}

export const rapportScoringService = new RapportScoringService();
