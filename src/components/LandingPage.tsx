import React from 'react';
import { LogIn, BookOpen, Zap, Target, Lock } from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => void;
}

export function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 backdrop-blur-sm sticky top-0 z-40 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="SSC To-Do Logo" className="w-10 h-10 rounded-xl shadow-lg object-cover" />
            <h1 className="text-2xl font-black text-slate-900">
              SSC <span className="text-indigo-600">TO-DO</span>
            </h1>
          </div>
          <button
            onClick={onSignIn}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-colors"
          >
            <LogIn size={18} />
            Sign In / Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Master SSC Preparation
            <br />
            <span className="text-indigo-600">One Task at a Time</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Plan daily, track progress, and ace your SSC exams with intelligent study management. Your personal study companion for systematic excellence.
          </p>
          <button
            onClick={onSignIn}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
          >
            Get Started Free
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="glass p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 hover:shadow-2xl transition-shadow">
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
              <BookOpen size={28} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Syllabus Tracking</h3>
            <p className="text-slate-600">
              Organize your SSC syllabus across Mathematics, English, Reasoning, and General Knowledge with detailed progress tracking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 hover:shadow-2xl transition-shadow">
            <div className="p-3 bg-amber-100 rounded-lg w-fit mb-4">
              <Target size={28} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Daily Blueprint</h3>
            <p className="text-slate-600">
              Plan your daily study schedule with intelligent blueprint creation. Track completion and maintain consistent habits.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 hover:shadow-2xl transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Zap size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Insights</h3>
            <p className="text-slate-600">
              Get personalized study recommendations powered by AI. Know what to focus on and where you stand in your preparation.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-4 mt-20 pt-20 border-t border-slate-200">
          <div className="text-center">
            <p className="text-4xl font-black text-indigo-600 mb-2">4</p>
            <p className="text-slate-600 font-medium">Main Subjects</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-indigo-600 mb-2">100%</p>
            <p className="text-slate-600 font-medium">Progress Tracking</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-indigo-600 mb-2">∞</p>
            <p className="text-slate-600 font-medium">Free Updates</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-indigo-600 mb-2">🤖</p>
            <p className="text-slate-600 font-medium">AI Powered</p>
          </div>
        </div>
      </section>

      {/* Security Badge */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock size={20} className="text-slate-600" />
            <p className="text-slate-600 font-medium">Your data is secure and private</p>
          </div>
          <p className="text-sm text-slate-500">
            All your study data is encrypted and stored securely. Access from any device, anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
