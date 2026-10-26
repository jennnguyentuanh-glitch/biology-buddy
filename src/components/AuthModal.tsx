import React, { useState } from 'react';
import { X, LogIn, UserPlus, Info } from 'lucide-react';
import { AuthUser } from '../types';
import { localSignIn, localSignUp } from '../lib/storage';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  noticeMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  onClose, 
  onSuccess,
  noticeMessage 
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = isSignUp 
      ? localSignUp(email, password)
      : localSignIn(email, password);

    if (result.error) {
      setError(result.error);
    } else if (result.user) {
      onSuccess(result.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 transition-colors">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Bioo</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {noticeMessage && (
          <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>{noticeMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@bioo.edu"
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
              Minimum 6 characters (stores locally in your browser)
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </>
            )}
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign in' : "New to Bioo? Create an account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
