import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export interface StudyAnalysis {
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  dailyFocus: string;
  overallProgress: string;
}

export class AIAnalysisService {
  private static groq = createGroq({
    apiKey: process.env.VITE_GROQ_API_KEY || '',
  });

  static async analyzeStudyPattern(stats: {
    mathsCompletion: number;
    englishCompletion: number;
    reasoningCompletion: number;
    gkCompletion: number;
    dailyCompletion: number;
    totalDaysTracked: number;
    recentStreak: number;
  }): Promise<StudyAnalysis> {
    try {
      if (!process.env.VITE_GROQ_API_KEY) {
        console.warn('[AI] Groq API key not configured, using default analysis');
        return this.getDefaultAnalysis(stats);
      }

      const prompt = `Analyze this SSC exam preparation data and provide personalized recommendations:

Subject Completion Rates:
- Mathematics: ${stats.mathsCompletion}%
- English: ${stats.englishCompletion}%
- Reasoning: ${stats.reasoningCompletion}%
- General Knowledge: ${stats.gkCompletion}%

Study Metrics:
- Daily Tasks Completion: ${stats.dailyCompletion}%
- Days Tracked: ${stats.totalDaysTracked}
- Current Streak: ${stats.recentStreak} days

Provide a JSON response with this exact structure:
{
  "weakAreas": ["subject1", "subject2"],
  "strongAreas": ["subject1", "subject2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "dailyFocus": "one main subject to focus on today",
  "overallProgress": "one sentence overall assessment"
}

Keep recommendations concise and actionable.`;

      const { text } = await generateText({
        model: this.groq('mixtral-8x7b-32768'),
        prompt,
        temperature: 0.7,
      });

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.getDefaultAnalysis(stats);
      }

      const analysis = JSON.parse(jsonMatch[0]);
      return {
        weakAreas: analysis.weakAreas || [],
        strongAreas: analysis.strongAreas || [],
        recommendations: analysis.recommendations || [],
        dailyFocus: analysis.dailyFocus || 'Mathematics',
        overallProgress: analysis.overallProgress || 'Keep up the good work!',
      };
    } catch (error) {
      console.error('[AI] Analysis failed:', error);
      return this.getDefaultAnalysis(stats);
    }
  }

  private static getDefaultAnalysis(stats: {
    mathsCompletion: number;
    englishCompletion: number;
    reasoningCompletion: number;
    gkCompletion: number;
    dailyCompletion: number;
    totalDaysTracked: number;
    recentStreak: number;
  }): StudyAnalysis {
    // Identify weak and strong areas
    const completions = [
      { subject: 'Mathematics', score: stats.mathsCompletion },
      { subject: 'English', score: stats.englishCompletion },
      { subject: 'Reasoning', score: stats.reasoningCompletion },
      { subject: 'General Knowledge', score: stats.gkCompletion },
    ];

    completions.sort((a, b) => a.score - b.score);

    const weakAreas = completions
      .slice(0, 2)
      .filter(c => c.score < 80)
      .map(c => c.subject);

    const strongAreas = completions
      .slice(-2)
      .filter(c => c.score > 70)
      .map(c => c.subject);

    return {
      weakAreas: weakAreas.length > 0 ? weakAreas : ['Reasoning'],
      strongAreas: strongAreas.length > 0 ? strongAreas : ['Mathematics'],
      recommendations: [
        weakAreas.length > 0 ? `Focus more on ${weakAreas[0]} to improve weak areas` : 'Maintain your strong foundation',
        `Maintain ${stats.recentStreak} day streak - consistency is key`,
        `Daily completion at ${stats.dailyCompletion}% - aim for 100% daily goals`,
      ],
      dailyFocus:
        weakAreas.length > 0 ? weakAreas[0] : completions[Math.floor(Math.random() * completions.length)].subject,
      overallProgress:
        stats.dailyCompletion > 80
          ? 'You are on track! Keep this momentum.'
          : 'Good progress. Increase daily task completion for faster growth.',
    };
  }
}
