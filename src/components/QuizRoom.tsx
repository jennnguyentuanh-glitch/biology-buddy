import React, { useState } from 'react';
import { Subtopic, Question, AuthUser } from '../types';
import { X, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordQuizCompletion } from '../lib/storage';

interface QuizRoomProps {
  subtopic: Subtopic;
  questions: Question[];
  currentUser?: AuthUser | null;
  onClose: () => void;
  onComplete?: (score: number) => void;
}

export const QuizRoom: React.FC<QuizRoomProps> = ({
  subtopic,
  questions,
  currentUser,
  onClose,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionIndex: number; selected: number; isCorrect: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correct_answer_index;
    setUserAnswers((prev) => [
      ...prev,
      { questionIndex: currentIndex, selected: idx, isCorrect }
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      setIsCompleted(true);
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const finalScorePercent = Math.round((correctCount / questions.length) * 100);
      recordQuizCompletion(subtopic.id, finalScorePercent, questions.length, correctCount, currentUser || null);
      if (onComplete) onComplete(finalScorePercent);

      if (finalScorePercent >= 70) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
  };

  if (!currentQ) {
    return null;
  }

  const totalCorrect = userAnswers.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((totalCorrect / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] my-auto transition-colors">
        {/* Top Bar: Subtopic Title + Progress Indicator + Close button */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {subtopic.code}
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {subtopic.title}
              </h2>
              {!isCompleted && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isCompleted && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close quiz"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Question Text */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 block">
                  Multiple Choice Question
                </span>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correct_answer_index;

                  let cardStyle = 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
                  let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                      badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                      badgeStyle = 'bg-rose-600 text-white border-rose-600';
                    } else {
                      cardStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 text-slate-400 dark:text-slate-600 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-150 cursor-pointer disabled:cursor-default ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3.5 flex-1">
                        <span className={`w-7 h-7 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 ${badgeStyle}`}>
                          {optionLetters[idx]}
                        </span>
                        <span className="text-sm sm:text-base font-medium leading-relaxed">
                          {opt}
                        </span>
                      </div>

                      {isAnswerSubmitted && (
                        <div className="shrink-0 pl-2">
                          {isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          )}
                          {isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation block immediately after submission */}
              {isAnswerSubmitted && (
                <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 mt-4 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                    {selectedOption === currentQ.correct_answer_index ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4 stroke-[3]" /> Correct!
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <X className="w-4 h-4 stroke-[3]" /> Incorrect
                      </span>
                    )}
                    <span className="text-slate-400 dark:text-slate-500">·</span>
                    <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">Explanation</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300 text-sm">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completion View */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Completed!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  You finished the quiz for <span className="font-semibold text-slate-800 dark:text-slate-200">{subtopic.title}</span>
                </p>
              </div>

              <div className="inline-flex items-center justify-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {totalCorrect} / {questions.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                    Correct Answers
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <div className={`text-3xl font-extrabold font-mono ${scorePercent >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {scorePercent}%
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                    Final Score
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto text-sm text-slate-600 dark:text-slate-300">
                {scorePercent >= 80 ? (
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                    Excellent mastery of this subtopic! Your progress has been saved.
                  </p>
                ) : scorePercent >= 60 ? (
                  <p className="text-indigo-700 dark:text-indigo-400 font-medium">
                    Good effort! Review the notes or flashcards to secure top exam marks.
                  </p>
                ) : (
                  <p className="text-amber-700 dark:text-amber-400 font-medium">
                    Consider reviewing the revision notes and taking this quiz again.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Return to Syllabus
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Next Question button */}
        {!isCompleted && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isAnswerSubmitted
                ? 'Press Next to proceed'
                : 'Select an option to submit your answer'}
            </span>

            <button
              onClick={handleNext}
              disabled={!isAnswerSubmitted}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                isAnswerSubmitted
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
