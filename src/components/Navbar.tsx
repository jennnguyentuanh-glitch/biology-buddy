import React from 'react';
import { AuthUser } from '../types';
import { LogIn, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

interface NavbarProps {
  user: AuthUser | null;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenSignIn: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  theme,
  onToggleTheme,
  onOpenSignIn, 
  onLogout,
  onOpenAdmin 
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand "Bioo" */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            B
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            Bioo
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80">
            Biology Buddy
          </span>
        </div>

        {/* Right: Theme Toggle & Auth / Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode (Night Study)'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-slate-200 text-[11px] font-mono">Day</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline text-slate-600 text-[11px] font-mono">Night</span>
              </>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {user.role === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors border border-transparent dark:border-slate-700"
                >
                  <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Admin</span>
                </button>
              )}
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate max-w-[130px] sm:max-w-[180px]">
                {user.name || user.email}
              </span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
