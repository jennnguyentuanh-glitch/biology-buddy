import React, { useState, useEffect } from 'react';
import { Subtopic, Flashcard } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Check, 
  RotateCcw, 
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardViewerProps {
  subtopic: Subtopic;
  flashcards: Flashcard[];
  onClose: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  subtopic,
  flashcards,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [practiceIds, setPracticeIds] = useState<Set<string>>(new Set());
  const [deckCompleted, setDeckCompleted] = useState(false);

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setDeckCompleted(true);
      if (masteredIds.size >= flashcards.length * 0.6) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMarkPractice = () => {
    if (!currentCard) return;
    setPracticeIds((prev) => new Set(prev).add(currentCard.id));
    setMasteredIds((prev) => {
      const copy = new Set(prev);
      copy.delete(currentCard.id);
      return copy;
    });
    handleNext();
  };

  const handleMarkMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => new Set(prev).add(currentCard.id));
    setPracticeIds((prev) => {
      const copy = new Set(prev);
      copy.delete(currentCard.id);
      return copy;
    });
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setDeckCompleted(false);
    setMasteredIds(new Set());
    setPracticeIds(new Set());
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (deckCompleted) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleMarkPractice();
      } else if (e.key === '2') {
        e.preventDefault();
        handleMarkMastered();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, deckCompleted, flashcards.length]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] my-auto transition-colors">
        {/* Top Bar: Subtopic Title + Mastery Counter + Close */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {subtopic.code}
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {subtopic.title}
              </h2>
              {!deckCompleted && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Card {currentIndex + 1} of {flashcards.length}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!deckCompleted && (
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {masteredIds.size} Mastered
                </span>
                <span className="text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                  {practiceIds.size} Review
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close flashcards"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center items-center overflow-y-auto">
          {!deckCompleted && currentCard ? (
            <div className="w-full flex flex-col items-center">
              {/* 3D Flip Card Container */}
              <div
                className="w-full max-w-lg h-72 sm:h-80 perspective-1000 cursor-pointer select-none"
                onClick={handleFlip}
                role="button"
                tabIndex={0}
                aria-label="Flashcard - click or press space to flip"
              >
                <div
                  className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Face: Term */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white to-slate-50/70 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/90 dark:border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-sm backface-hidden">
                    <div className="w-full flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {currentCard.category || 'Term / Concept'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                        <RotateCw className="w-3.5 h-3.5" />
                        Click to flip
                      </span>
                    </div>

                    <div className="my-auto px-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                        {currentCard.term}
                      </h3>
                    </div>

                    <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-mono text-slate-600 dark:text-slate-300">Space</kbd> or click to reveal definition
                    </div>
                  </div>

                  {/* Back Face: Definition */}
                  <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-850 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-md rotate-y-180 backface-hidden">
                    <div className="w-full flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span className="font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Definition & Mechanism
                      </span>
                      <span className="font-mono text-slate-400 dark:text-slate-500">
                        {currentCard.term}
                      </span>
                    </div>

                    <div className="my-auto px-2">
                      <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                        {currentCard.definition}
                      </p>
                    </div>

                    <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
                      Rate your recall below
                    </div>
                  </div>
                </div>
              </div>

              {/* Helper tip under card */}
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">
                Use arrow keys ← → to browse · Spacebar to flip card
              </p>
            </div>
          ) : (
            /* Completed Deck Summary */
            <div className="text-center py-6 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Deck Complete!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  You reviewed all {flashcards.length} flashcards for{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{subtopic.title}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    {masteredIds.size}
                  </div>
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mt-0.5">
                    Mastered
                  </div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 font-mono">
                    {practiceIds.size}
                  </div>
                  <div className="text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider mt-0.5">
                    Need Practice
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Review Again
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

        {/* Bottom Bar: Red Cross & Green Tick & Arrow Navigation */}
        {!deckCompleted && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            {/* Left arrow */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Core Action Buttons: Red Cross + Green Tick */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkPractice}
                className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-white dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                <span>✖ Need Practice</span>
              </button>

              <button
                onClick={handleMarkMastered}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>✔ Got It</span>
              </button>
            </div>

            {/* Right arrow */}
            <button
              onClick={handleNext}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
