import React from 'react';
import { LeaderboardEntry, AuthUser } from '../types';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUser: AuthUser | null;
  onOpenSignIn: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUser,
  onOpenSignIn
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
      {/* Intro strip */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Biology Leaderboard
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rankings dynamically updated based on local quiz performance and accuracy
            </p>
          </div>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenSignIn}
            className="px-3.5 py-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
          >
            Sign in to join rankings
          </button>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3 w-16">Rank</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3 text-center">Quizzes</th>
                <th className="px-5 py-3 text-center">Questions Solved</th>
                <th className="px-5 py-3 text-center">Avg Accuracy</th>
                <th className="px-5 py-3 text-right">Top Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                    No quiz entries yet. Complete a chapter quiz to enter the leaderboard!
                  </td>
                </tr>
              ) : (
                entries.map((item, idx) => {
                  const isCurrent = currentUser?.email.toLowerCase() === item.email.toLowerCase();
                  const rank = idx + 1;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/40 font-medium'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono font-bold">
                          {rank === 1 && (
                            <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs">
                              1
                            </span>
                          )}
                          {rank === 2 && (
                            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs">
                              2
                            </span>
                          )}
                          {rank === 3 && (
                            <span className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-xs">
                              3
                            </span>
                          )}
                          {rank > 3 && (
                            <span className="text-slate-400 dark:text-slate-500 pl-1.5 text-xs">
                              #{rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Student info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs uppercase">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{item.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                              {item.badge && (
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                                  · {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Quizzes Completed */}
                      <td className="px-5 py-3.5 text-center font-mono font-medium">
                        {item.quizzesCompleted}
                      </td>

                      {/* Questions Solved */}
                      <td className="px-5 py-3.5 text-center font-mono">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.totalCorrectAnswers || 0}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]"> / {item.totalQuestionsAnswered || 0}</span>
                      </td>

                      {/* Accuracy */}
                      <td className="px-5 py-3.5 text-center font-mono">
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          {item.accuracy}%
                        </span>
                      </td>

                      {/* Top Score */}
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {item.score}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
