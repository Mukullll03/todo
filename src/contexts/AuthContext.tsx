import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhone: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-login with demo account
    const autoLogin = async () => {
      try {
        // Demo account credentials
        const demoEmail = 'demo@sscapp.local';
        const demoPassword = 'Demo@SSC123456';

        // Try to get existing session first
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          setLoading(false);
          return;
        }

        // If no session, try to sign in with demo account
        const { data, error } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });

        if (error) {
          // If demo account doesn't exist, create it
          if (error.message.includes('Invalid login credentials')) {
            console.log('[v0] Creating demo account...');
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: demoEmail,
              password: demoPassword,
              options: {
                data: {
                  isDemo: true,
                  displayName: 'Demo User',
                },
              },
            });

            if (signUpError) {
              console.error('[v0] Error creating demo account:', signUpError);
              setLoading(false);
              return;
            }

            // Try to sign in again
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email: demoEmail,
              password: demoPassword,
            });

            if (loginError) {
              console.error('[v0] Error signing in to demo account:', loginError);
            } else if (loginData.session) {
              setSession(loginData.session);
              setUser(loginData.session.user);
            }
          } else {
            console.error('[v0] Error during auto-login:', error);
          }
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('[v0] Exception during auto-login:', error);
      } finally {
        setLoading(false);
      }
    };

    autoLogin();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) {
        console.error('[v0] Sign up error:', signUpError.message);
        return { error: signUpError };
      }

      console.log('[v0] Sign up successful, attempting auto sign-in');

      // After signup, automatically sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('[v0] Auto sign-in after signup failed:', signInError.message);
        return { error: signInError };
      }

      console.log('[v0] Auto sign-in successful after signup');
      return { error: null };
    } catch (error) {
      console.error('[v0] Sign up exception:', error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[v0] Sign in error:', error.message, error.code);
        return { error };
      }

      if (data?.session) {
        console.log('[v0] Sign in successful, session created');
        setSession(data.session);
        setUser(data.session.user);
      }

      return { error: null };
    } catch (error) {
      console.error('[v0] Sign in exception:', error);
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // For Vite app, use the current origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('[v0] Google sign in error:', error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('[v0] Google sign in exception:', error);
      return { error: error as Error };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        console.error('[v0] Phone sign in error:', error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('[v0] Phone sign in exception:', error);
      return { error: error as Error };
    }
  };

  const verifyPhone = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) {
        console.error('[v0] Phone verification error:', error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('[v0] Phone verification exception:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signInWithGoogle, signInWithPhone, verifyPhone, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
