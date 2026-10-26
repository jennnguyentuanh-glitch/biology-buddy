import React from 'react';
import { Mode } from '../types';
import { HelpCircle, Layers, Trophy } from 'lucide-react';

interface ModeSelectorProps {
  activeMode: Mode;
  onSelectMode: (mode: Mode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onSelectMode }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-4">
      <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg gap-1 border border-slate-200/60 dark:border-slate-800 transition-colors">
        <button
          onClick={() => onSelectMode('quiz')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            activeMode === 'quiz'
              ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quiz</span>
        </button>

        <button
          onClick={() => onSelectMode('flashcards')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            activeMode === 'flashcards'
              ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Flashcards</span>
        </button>

        <button
          onClick={() => onSelectMode('leaderboard')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            activeMode === 'leaderboard'
              ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Leaderboard</span>
        </button>
      </div>
    </div>
  );
};
