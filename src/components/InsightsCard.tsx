import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Brain, TrendingUp, Target } from 'lucide-react';
import { AIAnalysisService, StudyAnalysis } from '../lib/aiAnalysisService';

interface InsightsCardProps {
  stats: {
    mathsCompletion: number;
    englishCompletion: number;
    reasoningCompletion: number;
    gkCompletion: number;
    dailyCompletion: number;
    totalDaysTracked: number;
    recentStreak: number;
  };
}

export function InsightsCard({ stats }: InsightsCardProps) {
  const [analysis, setAnalysis] = useState<StudyAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        const result = await AIAnalysisService.analyzeStudyPattern(stats);
        setAnalysis(result);
        setError(null);
      } catch (err) {
        console.error('[InsightsCard] Error loading analysis:', err);
        setError('Could not load AI analysis');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [stats]);

  if (loading) {
    return (
      <div className="glass p-4 md:p-6 rounded-lg md:rounded-2xl border border-slate-200 shadow-xl shadow-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900">AI Study Insights</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="glass p-4 md:p-6 rounded-lg md:rounded-2xl border border-slate-200 shadow-xl shadow-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900">AI Study Insights</h3>
        </div>
        <div className="flex items-start gap-3 py-4">
          <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">Analysis unavailable. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-4 md:p-6 rounded-lg md:rounded-2xl border border-slate-200 shadow-xl shadow-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900">AI Study Insights</h3>
          <p className="text-xs text-slate-500">Powered by AI Analysis</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
        <p className="text-sm text-indigo-900 font-medium">{analysis.overallProgress}</p>
      </div>

      {/* Daily Focus */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Target size={18} className="text-amber-600" />
          <h4 className="font-bold text-slate-900">Today&apos;s Focus</h4>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-semibold text-amber-900">{analysis.dailyFocus}</p>
        </div>
      </div>

      {/* Weak Areas */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={18} className="text-red-600" />
          <h4 className="font-bold text-slate-900">Areas to Improve</h4>
        </div>
        <div className="space-y-2">
          {analysis.weakAreas.length > 0 ? (
            analysis.weakAreas.map((area, idx) => (
              <div key={idx} className="p-2 bg-red-50 border border-red-100 rounded">
                <p className="text-sm text-red-900">{area}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No weak areas detected!</p>
          )}
        </div>
      </div>

      {/* Strong Areas */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} className="text-green-600" />
          <h4 className="font-bold text-slate-900">Strengths</h4>
        </div>
        <div className="space-y-2">
          {analysis.strongAreas.length > 0 ? (
            analysis.strongAreas.map((area, idx) => (
              <div key={idx} className="p-2 bg-green-50 border border-green-100 rounded">
                <p className="text-sm text-green-900">{area}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Build your strengths with consistent practice!</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-bold text-slate-900 mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="text-indigo-600 font-bold flex-shrink-0">{idx + 1}.</span>
              <span className="text-sm text-slate-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
