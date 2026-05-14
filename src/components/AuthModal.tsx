import React, { useState } from 'react';
import { X, Loader2, Mail, Phone, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle, signInWithPhone } = useAuth();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneToken, setPhoneToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneSent, setPhoneSent] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          console.error('[v0] Auth error:', error);
          setError(error.message || 'Sign up failed');
        } else {
          setSuccess('Account created successfully!');
          setTimeout(() => {
            onClose();
            setEmail('');
            setPassword('');
            setAuthMethod(null);
            setIsSignUp(false);
          }, 1500);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          console.error('[v0] Auth error:', error);
          setError(error.message || 'Sign in failed');
        } else {
          setSuccess('Signed in successfully!');
          setTimeout(() => {
            onClose();
            setEmail('');
            setPassword('');
            setAuthMethod(null);
          }, 1000);
        }
      }
    } catch (err) {
      console.error('[v0] Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!phoneSent && !phone) {
        setError('Please enter your phone number');
        setLoading(false);
        return;
      }

      if (!phoneSent) {
        const { error } = await signInWithPhone(phone);
        if (error) {
          setError(error.message || 'Failed to send OTP');
        } else {
          setSuccess('OTP sent to your phone!');
          setPhoneSent(true);
        }
      } else {
        if (!phoneToken) {
          setError('Please enter the OTP');
          setLoading(false);
          return;
        }
        setSuccess('Signed in successfully!');
        setTimeout(() => {
          onClose();
          setPhone('');
          setPhoneToken('');
          setPhoneSent(false);
          setAuthMethod(null);
        }, 1000);
      }
    } catch (err) {
      console.error('[v0] Phone auth error:', err);
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message || 'Google sign in failed');
      }
    } catch (err) {
      console.error('[v0] Google sign in error:', err);
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const resetForm = () => {
    setAuthMethod(null);
    setEmail('');
    setPassword('');
    setPhone('');
    setPhoneToken('');
    setPhoneSent(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {authMethod ? (authMethod === 'email' ? (isSignUp ? 'Create Account' : 'Sign In') : 'Phone Verification') : 'Sign In / Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {!authMethod ? (
            // Auth Method Selection
            <div className="space-y-3">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <Chrome size={20} />
                Continue with Google
              </button>

              {/* Email Sign In */}
              <button
                onClick={() => setAuthMethod('email')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                <Mail size={20} />
                Continue with Email
              </button>

              {/* Phone Sign In */}
              <button
                onClick={() => setAuthMethod('phone')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                <Phone size={20} />
                Continue with Phone
              </button>
            </div>
          ) : authMethod === 'email' ? (
            // Email Form
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs sm:text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 sm:py-2.5 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              {/* Toggle */}
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  {isSignUp ? 'Already have an account?' : 'Don&apos;t have an account?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setSuccess('');
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              {/* Back Button */}
              <button
                type="button"
                onClick={resetForm}
                className="w-full text-gray-600 hover:text-gray-900 text-xs sm:text-sm font-medium py-2"
              >
                ← Back to sign in options
              </button>
            </form>
          ) : (
            // Phone Form
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {/* Phone Number */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={phoneSent}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              {/* OTP Input (shown after sending) */}
              {phoneSent && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={phoneToken}
                    onChange={(e) => setPhoneToken(e.target.value)}
                    placeholder="000000"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs sm:text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 sm:py-2.5 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {phoneSent ? 'Verify Code' : 'Send Code'}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={resetForm}
                className="w-full text-gray-600 hover:text-gray-900 text-xs sm:text-sm font-medium py-2"
              >
                ← Back to sign in options
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
