import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, LogOut, Mail, Lock } from 'lucide-react';

interface AuthProps {
  userId: string | undefined;
  onAuthChange: (userId: string | undefined) => void;
}

export function Auth({ userId, onAuthChange }: AuthProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        onAuthChange(data.user.id);
        setShowAuth(false);
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      if (data.user) {
        onAuthChange(data.user.id);
        setShowAuth(false);
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      onAuthChange(undefined);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!userId) {
    return (
      <div className="fixed top-4 right-4 z-40">
        {!isSupabaseConfigured ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 w-64 text-sm">
            <p className="text-amber-900 font-semibold mb-2">Offline Mode</p>
            <p className="text-amber-800 text-xs mb-3">Add Supabase credentials to enable cloud sync and authentication.</p>
            <p className="text-amber-700 text-xs">Your data is saved locally for now.</p>
          </div>
        ) : !showAuth ? (
          <button
            onClick={() => setShowAuth(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg"
          >
            <LogIn size={18} />
            Sign In
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
            
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="w-full mt-3 py-2 text-slate-600 font-semibold text-sm hover:text-indigo-600 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
            
            <button
              onClick={() => setShowAuth(false)}
              className="w-full mt-2 py-2 text-slate-400 text-sm hover:text-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
    >
      <LogOut size={18} />
      Sign Out
    </button>
  );
}
