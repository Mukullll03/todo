import React, { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">●</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-gray-700 text-[10px] sm:text-xs md:text-sm font-medium">SSC</span>
              <span className="text-blue-600 font-bold text-xs sm:text-base md:text-lg leading-tight">TO-DO</span>
            </div>
          </div>

          {/* Auth Section */}
          <div>
            {!user ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">→</span>
                <span className="sm:hidden">Sign In</span>
                <span className="hidden sm:inline">Sign In / Sign Up</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[80px] sm:max-w-none">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-600 flex-shrink-0 hidden sm:block" />
                </button>

                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 sm:px-4 py-2 border-b border-gray-200 break-words">
                      <p className="text-[10px] sm:text-xs text-gray-500">Signed in as</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 break-all">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-xs sm:text-sm font-medium"
                    >
                      <LogOut size={14} className="flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
