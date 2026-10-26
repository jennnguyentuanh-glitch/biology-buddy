import React from 'react';
import { Subtopic, SubtopicNote } from '../types';
import { X, BookOpen, AlertTriangle, Lightbulb, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface NotesViewerProps {
  subtopic: Subtopic;
  note: SubtopicNote;
  onClose: () => void;
  onLaunchQuiz: () => void;
}

export const NotesViewer: React.FC<NotesViewerProps> = ({
  subtopic,
  note,
  onClose,
  onLaunchQuiz
}) => {
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
                Revision Notes & Key Concepts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchQuiz}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Test with Quiz</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close notes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Executive Summary */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Syllabus Summary
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {note.summary}
            </p>
          </div>

          {/* Key Revision Points */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              Key High-Yield Concepts
            </h3>
            <ul className="space-y-2.5">
              {note.key_points.map((pt, idx) => (
                <li
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg p-3.5 text-sm text-slate-700 flex items-start gap-3 shadow-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          {note.common_mistakes && note.common_mistakes.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Common Exam Pitfalls & Misconceptions
              </div>
              <ul className="space-y-2">
                {note.common_mistakes.map((mistake, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">⚠</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Examiner Tip */}
          {note.exam_tip && (
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Examiner Tip
              </div>
              <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
                {note.exam_tip}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            Close
          </button>

          <button
            onClick={onLaunchQuiz}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <span>Practice Quiz Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
