import React from 'react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span>Creator: <strong className="font-medium text-slate-700 dark:text-slate-200">Anh Nguyen Tu</strong></span>
        </div>

        <div>
          <button
            onClick={onOpenAdmin}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium hover:underline cursor-pointer"
          >
            Admin Portal
          </button>
        </div>

        <div>
          <span>© 2026 Bioo</span>
        </div>
      </div>
    </footer>
  );
};
