import React, { useState } from 'react';
import { Topic, Subtopic, Mode } from '../types';
import { X, CheckSquare, Square, ArrowRight, Layers, HelpCircle, Sparkles } from 'lucide-react';

interface MultiSubtopicModalProps {
  topics: Topic[];
  activeMode: Mode;
  onClose: () => void;
  onStartCombined: (selectedSubtopics: Subtopic[], targetMode: Mode) => void;
}

export const MultiSubtopicModal: React.FC<MultiSubtopicModalProps> = ({
  topics,
  activeMode,
  onClose,
  onStartCombined
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1.1', '1.2']));
  const [sessionMode, setSessionMode] = useState<Mode>(activeMode);

  const toggleSubtopic = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    const all = new Set<string>();
    topics.forEach((t) => t.subtopics.forEach((s) => all.add(s.id)));
    setSelectedIds(all);
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleStart = () => {
    const selectedList: Subtopic[] = [];
    topics.forEach((t) => {
      t.subtopics.forEach((s) => {
        if (selectedIds.has(s.id)) {
          selectedList.push(s);
        }
      });
    });
    if (selectedList.length > 0) {
      onStartCombined(selectedList, sessionMode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Study Multiple Subtopics
            </h2>
            <p className="text-xs text-slate-500">
              Select any combination of subtopics to create a tailored revision session
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Mode Selector for combined study */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Select Session Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSessionMode('quiz')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  sessionMode === 'quiz'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <HelpCircle className={`w-5 h-5 ${sessionMode === 'quiz' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="text-sm font-semibold">Combined Quiz</div>
                  <div className="text-xs text-slate-500">Practice questions across topics</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSessionMode('flashcards')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  sessionMode === 'flashcards'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Layers className={`w-5 h-5 ${sessionMode === 'flashcards' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="text-sm font-semibold">Combined Flashcards</div>
                  <div className="text-xs text-slate-500">Master mixed key terminology</div>
                </div>
              </button>
            </div>
          </div>

          {/* Subtopic checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Syllabus Areas ({selectedIds.size} Selected)
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Select All
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-slate-500 hover:underline font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {topics.map((t) => (
                <div key={t.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    {t.title}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {t.subtopics.map((s) => {
                      const isChecked = selectedIds.has(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSubtopic(s.id)}
                          className={`text-left p-2 rounded-lg border flex items-start gap-2.5 transition-colors ${
                            isChecked
                              ? 'bg-white border-indigo-300 text-slate-900 shadow-xs'
                              : 'bg-white/60 border-slate-200/60 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <div className="mt-0.5 text-indigo-600 shrink-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <span className="text-xs font-medium leading-tight">
                            <span className="font-mono text-slate-500 mr-1.5">{s.code}</span>
                            {s.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {selectedIds.size === 0
              ? 'Select at least 1 subtopic to continue'
              : `${selectedIds.size} subtopic${selectedIds.size > 1 ? 's' : ''} ready`}
          </span>

          <button
            onClick={handleStart}
            disabled={selectedIds.size === 0}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
              selectedIds.size > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Start Combined Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
