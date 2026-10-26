import React, { useState } from 'react';
import { Subtopic, PastPaperQuestion } from '../types';
import { X, FileCheck, Eye, EyeOff, Award, HelpCircle } from 'lucide-react';

interface PastPapersViewerProps {
  subtopic: Subtopic;
  papers: PastPaperQuestion[];
  onClose: () => void;
}

export const PastPapersViewer: React.FC<PastPapersViewerProps> = ({
  subtopic,
  papers,
  onClose
}) => {
  const [showMarkScheme, setShowMarkScheme] = useState<Record<string, boolean>>({});

  const toggleMarkScheme = (id: string) => {
    setShowMarkScheme((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {subtopic.code}
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 line-clamp-1">
                {subtopic.title}
              </h2>
              <p className="text-xs text-slate-500">
                Official Past Paper Exam Questions & Mark Schemes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close past papers"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {papers.map((item, idx) => {
            const isRevealed = showMarkScheme[item.id] ?? false;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                      {item.year}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.paper}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                    [{item.marks} Marks]
                  </span>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-medium text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                  {item.question_text}
                </div>

                {/* Mark Scheme Toggle Button */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleMarkScheme(item.id)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Hide Mark Scheme & Guidance</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Show Official Mark Scheme</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Mark Scheme Details */}
                {isRevealed && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Official Mark Scheme Breakdown
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950">
                        {item.mark_scheme.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {item.guidance && (
                      <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-800">
                        <span className="font-semibold">Examiner Note:</span> {item.guidance}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
