import React, { useState, useEffect } from 'react';
import { 
  Topic, 
  Subtopic, 
  Mode, 
  AuthUser,
  Question, 
  Flashcard,
  LeaderboardEntry 
} from './types';
import { 
  getTopics, 
  getQuestionsByChapter, 
  getFlashcardsByChapter,
  localGetCurrentUser,
  localSignOut,
  getLeaderboard
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { CourseHeader } from './components/CourseHeader';
import { ModeSelector } from './components/ModeSelector';
import { TopicAccordion } from './components/TopicAccordion';
import { Leaderboard } from './components/Leaderboard';
import { QuizRoom } from './components/QuizRoom';
import { FlashcardViewer } from './components/FlashcardViewer';
import { AuthModal } from './components/AuthModal';
import { FeedbackModal } from './components/FeedbackModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { useTheme } from './hooks/useTheme';

export default function App() {
  // Theme state (light / dark)
  const { theme, toggleTheme } = useTheme();

  // Local Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState<string>('');

  // Syllabus topics (all 6 units and 22 chapters)
  const [topics, setTopics] = useState<Topic[]>([]);

  // Active mode: 'quiz' | 'flashcards' | 'leaderboard'
  const [activeMode, setActiveMode] = useState<Mode>('quiz');

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Loading state for lazy chapter data retrieval
  const [loadingSubtopicId, setLoadingSubtopicId] = useState<string | null>(null);

  // Active viewer states
  const [activeQuiz, setActiveQuiz] = useState<{ subtopic: Subtopic; questions: Question[] } | null>(null);
  const [activeFlashcards, setActiveFlashcards] = useState<{ subtopic: Subtopic; flashcards: Flashcard[] } | null>(null);

  // Admin portal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load local state on mount
  useEffect(() => {
    const session = localGetCurrentUser();
    if (session) {
      setUser(session);
    }
    setTopics(getTopics());
    setLeaderboard(getLeaderboard());
  }, []);

  /**
   * QUIZ GATE:
   * Require user to sign in before opening Quiz or Flashcard modes!
   */
  const handleSelectSubtopic = async (subtopic: Subtopic) => {
    if (!user) {
      setAuthNotice(
        `Please sign in to practice Chapter ${subtopic.code} (${subtopic.title}) and track your scores on the Leaderboard.`
      );
      setIsAuthModalOpen(true);
      return;
    }

    setLoadingSubtopicId(subtopic.id);

    try {
      if (activeMode === 'quiz') {
        const questions = await getQuestionsByChapter(subtopic.id);
        setActiveQuiz({ subtopic, questions });
      } else if (activeMode === 'flashcards') {
        const flashcards = await getFlashcardsByChapter(subtopic.id);
        setActiveFlashcards({ subtopic, flashcards });
      }
    } catch (error) {
      console.error('Error fetching chapter data:', error);
    } finally {
      setLoadingSubtopicId(null);
    }
  };

  const handleLogout = () => {
    localSignOut();
    setUser(null);
  };

  const handleQuizFinish = () => {
    // Refresh local leaderboard rankings
    setLeaderboard(getLeaderboard());
    const refreshed = localGetCurrentUser();
    if (refreshed) {
      setUser(refreshed);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Header: Logo "Bioo", Theme Toggle, Local Auth trigger */}
      <Navbar
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSignIn={() => {
          setAuthNotice('');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Minimal Course Banner: Title + Subtitle only */}
      <CourseHeader />

      {/* 3. Navigation Tabs: [ Quiz ] [ Flashcards ] [ Leaderboard ] */}
      <ModeSelector
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
      />

      {/* 4. Main Body: Accordion Topic List OR Leaderboard */}
      <main className="flex-1">
        {activeMode === 'leaderboard' ? (
          <Leaderboard
            entries={leaderboard}
            currentUser={user}
            onOpenSignIn={() => {
              setAuthNotice('Sign in to record your scores and climb the rankings!');
              setIsAuthModalOpen(true);
            }}
          />
        ) : (
          <TopicAccordion
            topics={topics}
            activeMode={activeMode}
            onSelectSubtopic={handleSelectSubtopic}
            loadingSubtopicId={loadingSubtopicId}
          />
        )}
      </main>

      {/* 5. Modals & Overlays */}
      {/* Quiz Room */}
      {activeQuiz && (
        <QuizRoom
          subtopic={activeQuiz.subtopic}
          questions={activeQuiz.questions}
          currentUser={user}
          onClose={() => setActiveQuiz(null)}
          onComplete={handleQuizFinish}
        />
      )}

      {/* Flashcard Viewer */}
      {activeFlashcards && (
        <FlashcardViewer
          subtopic={activeFlashcards.subtopic}
          flashcards={activeFlashcards.flashcards}
          onClose={() => setActiveFlashcards(null)}
        />
      )}

      {/* Local Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(authenticatedUser) => {
            setUser(authenticatedUser);
            setLeaderboard(getLeaderboard());
          }}
          noticeMessage={authNotice}
        />
      )}

      {/* Admin Portal Modal (Hardcoded nguyentuanh.jenn@gmail.com / 135246) */}
      {isAdminOpen && (
        <AdminPortal
          topics={topics}
          currentUser={user}
          onClose={() => setIsAdminOpen(false)}
          onAdminLoginSuccess={(adminUser) => {
            setUser(adminUser);
            setLeaderboard(getLeaderboard());
          }}
        />
      )}

      {/* Floating Circular Feedback Button fixed at bottom-left */}
      <FeedbackModal userEmail={user?.email || 'student@bioo.edu'} />

      {/* Footer: Creator: Anh Nguyen Tu | Admin Portal | © 2026 Bioo */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
    </div>
  );
}
