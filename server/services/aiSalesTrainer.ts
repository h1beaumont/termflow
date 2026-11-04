// AI Sales Trainer Service
// Analyzes call transcripts and provides coaching insights for sales improvement

import OpenAI from "openai";
import { storage } from "../storage";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI secret: OPENAI_API_KEY');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ConversionOpportunity {
  opportunity: string;
  confidence: number;
  suggestion: string;
}

interface ProfileInsight {
  insightType: string;
  insightValue: any;
  confidence: number;
}

interface ViewingMention {
  mentioned: boolean;
  details?: string;
  confidence: number;
}

interface SalesAnalysis {
  aiCoachSummary: string;
  conversionOpportunities: ConversionOpportunity[];
  missedTalkingPoints: string[];
  skillFocusAreas: string[];
  improvementScore: number;
  profileInsights: ProfileInsight[];
  viewingMention: ViewingMention;
}

const SALES_COACHING_PROMPT = `You are an expert sales coach analyzing student accommodation sales calls. 

Analyze the following call transcript and provide detailed coaching insights:

1. **Conversion Opportunities Missed**: Identify specific moments where the sales representative could have converted better. For each opportunity, provide:
   - What was missed
   - Confidence score (0-1)
   - Specific suggestion for improvement

2. **Key Talking Points Missed**: List important selling points that should have been mentioned but weren't (e.g., deposit options, viewing availability, amenities, location benefits)

3. **Skill Focus Areas**: Identify 2-4 key areas for improvement (e.g., rapport building, objection handling, closing techniques, urgency creation, active listening)

4. **Student Profile Data**: Extract comprehensive demographic and behavioral information:
   - Budget/price range
   - Room preferences (studio, en-suite, cluster)
   - Move-in date
   - Nationality/home country
   - University name
   - Course of study
   - Year of study (first year, second year, postgraduate)
   - Age range (18-21, 22-25, 26-30, 30+)
   - Gender (if mentioned naturally)
   - Visa status (student visa, UK resident, EU settled status)
   - English proficiency level (native, fluent, intermediate, basic)
   - Pain points/concerns (location, price, facilities, contract flexibility, etc.)
   - Parent involvement (are parents involved in decision-making?)
   - Decision timeline (urgent, 1-2 weeks, 1 month, flexible)
   - Referral source (friend, agent, university, social media)

5. **Viewing Bookings**: Did they discuss or book a viewing? Extract details.

6. **Improvement Score**: Give an overall score 0-100 comparing this call to expected baseline performance.

Return your analysis as a JSON object with this structure:
{
  "aiCoachSummary": "2-3 sentence overall coaching feedback",
  "conversionOpportunities": [
    {
      "opportunity": "Description of what was missed",
      "confidence": 0.85,
      "suggestion": "How to handle this better next time"
    }
  ],
  "missedTalkingPoints": ["point1", "point2"],
  "skillFocusAreas": ["skill1", "skill2"],
  "improvementScore": 75,
  "profileInsights": [
    {
      "insightType": "budget",
      "insightValue": {"min": 150, "max": 200, "currency": "GBP", "period": "week"},
      "confidence": 0.9
    },
    {
      "insightType": "university",
      "insightValue": "University of Nottingham",
      "confidence": 0.95
    }
  ],
  "viewingMention": {
    "mentioned": true,
    "details": "Student wants to book viewing for next Tuesday",
    "confidence": 0.9
  }
}

Be specific and actionable in your coaching feedback. Focus on real opportunities for improvement.`;

export class AISalesTrainerService {
  /**
   * Analyze a call transcript and generate coaching insights
   */
  async analyzeCallTranscript(
    callLogId: string,
    transcript: any,
    leadId?: string
  ): Promise<SalesAnalysis> {
    try {
      // Format transcript for analysis
      const transcriptText = this.formatTranscript(transcript);
      
      // Get lead context if available
      let leadContext = "";
      if (leadId) {
        const lead = await storage.getLead(leadId);
        if (lead) {
          leadContext = `\n\nLead Context:\n- Name: ${lead.name || 'Unknown'}\n- Stage: ${lead.stage}\n- University: ${lead.universityName || 'Not specified'}\n- Course: ${lead.courseName || 'Not specified'}`;
        }
      }

      // Call OpenAI for analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: SALES_COACHING_PROMPT,
          },
          {
            role: "user",
            content: `CALL TRANSCRIPT:\n${transcriptText}${leadContext}\n\nProvide your coaching analysis in JSON format.`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const analysisText = response.choices[0].message.content || "{}";
      const analysis: SalesAnalysis = JSON.parse(analysisText);

      // Validate and set defaults
      return {
        aiCoachSummary: analysis.aiCoachSummary || "Analysis complete.",
        conversionOpportunities: analysis.conversionOpportunities || [],
        missedTalkingPoints: analysis.missedTalkingPoints || [],
        skillFocusAreas: analysis.skillFocusAreas || [],
        improvementScore: analysis.improvementScore || 50,
        profileInsights: analysis.profileInsights || [],
        viewingMention: analysis.viewingMention || { mentioned: false, confidence: 0 },
      };
    } catch (error) {
      console.error('AI Sales Trainer analysis error:', error);
      throw new Error('Failed to analyze call transcript');
    }
  }

  /**
   * Format transcript array into readable text
   */
  private formatTranscript(transcript: any): string {
    if (!transcript || !Array.isArray(transcript)) {
      return "No transcript available";
    }

    return transcript
      .map((line: any) => {
        const speaker = line.speaker_id || line.speaker || 'Speaker';
        const text = line.sentence || line.text || line.content || '';
        return `${speaker}: ${text}`;
      })
      .join('\n');
  }

  /**
   * Find potential viewing record that matches the call
   */
  async findMatchingViewing(
    leadId: string,
    viewingDetails: string
  ): Promise<string | null> {
    try {
      const viewings = await storage.getViewingsByLead(leadId);
      
      if (viewings.length === 0) {
        return null;
      }

      // For now, return the most recent viewing
      // In the future, could use AI to match based on details
      const sortedViewings = viewings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return sortedViewings[0].id;
    } catch (error) {
      console.error('Error finding matching viewing:', error);
      return null;
    }
  }

  /**
   * Calculate baseline score for a landlord's calls
   */
  async calculateBaselineScore(landlordId: string): Promise<number> {
    try {
      const callLogs = await storage.getCallLogsByLandlord(landlordId);
      
      if (callLogs.length === 0) {
        return 50; // Default baseline
      }

      const callsWithScores = callLogs.filter(log => log.callScore !== null);
      
      if (callsWithScores.length === 0) {
        return 50;
      }

      const avgScore = callsWithScores.reduce((sum, log) => sum + (log.callScore || 0), 0) / callsWithScores.length;
      return Math.round(avgScore);
    } catch (error) {
      console.error('Error calculating baseline score:', error);
      return 50;
    }
  }

  /**
   * Generate improvement score based on baseline
   */
  async calculateImprovementScore(
    landlordId: string,
    currentCallScore: number
  ): Promise<number> {
    const baseline = await this.calculateBaselineScore(landlordId);
    return currentCallScore - baseline;
  }
}

export const aiSalesTrainerService = new AISalesTrainerService();
