import { 
  Topic, 
  Question, 
  Flashcard, 
  Feedback, 
  LeaderboardEntry, 
  AuthUser,
  StoredUser
} from '../types';
import { 
  SYLLABUS_TOPICS, 
  INITIAL_QUESTIONS, 
  INITIAL_FLASHCARDS, 
  INITIAL_LEADERBOARD, 
  INITIAL_FEEDBACKS 
} from '../data/data';

// Storage keys - version bumped to v3 to ensure zero lingering fake/mock users
const STORAGE_KEYS = {
  TOPICS: 'bioo_topics_v1',
  QUESTIONS: 'bioo_questions_v1',
  FLASHCARDS: 'bioo_flashcards_v1',
  FEEDBACKS: 'bioo_feedbacks_v1',
  SESSION: 'bioo_session_v3',
  USERS: 'bioo_registered_accounts_v3',
  PROGRESS: 'bioo_progress_v3'
};

// Hardcoded Admin Credentials as specified
export const ADMIN_CREDENTIALS = {
  email: 'nguyentuanh.jenn@gmail.com',
  password: '135246'
};

/**
 * Filter list to guarantee zero mock users
 */
function sanitizeUsers(users: StoredUser[]): StoredUser[] {
  const bannedNames = ['sophia chen', 'marcus taylor', 'alex student', 'demo student', 'user-demo'];
  const bannedEmails = ['student@bioo.edu', 'sophia@example.com', 'marcus@example.com'];
  
  return users.filter((u) => {
    if (!u || !u.email) return false;
    const lowerName = (u.name || '').toLowerCase();
    const lowerEmail = u.email.toLowerCase();
    if (bannedNames.some(b => lowerName.includes(b))) return false;
    if (bannedEmails.some(b => lowerEmail.includes(b))) return false;
    if (u.id === 'user-demo') return false;
    return true;
  });
}

/**
 * Initialize all local database seeds on startup
 */
export function initializeLocalStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.TOPICS)) {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(SYLLABUS_TOPICS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FLASHCARDS)) {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(INITIAL_FLASHCARDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACKS)) {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
  }

  // Ensure accounts storage exists, strictly containing ONLY real accounts (admin by default)
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultAccounts: StoredUser[] = [
      {
        id: 'admin-root',
        email: ADMIN_CREDENTIALS.email,
        name: 'Anh Nguyen Tu',
        password: ADMIN_CREDENTIALS.password,
        role: 'admin',
        score: 100,
        quizzesCompleted: 22,
        totalQuestionsAnswered: 110,
        totalCorrectAnswers: 110,
        createdAt: '2026-01-01T00:00:00.000Z',
        lastActive: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultAccounts));
  } else {
    // Purge any lingering dummy users
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const sanitized = sanitizeUsers(existing);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sanitized));
    } catch {
      // fallback
    }
  }
}

// Call seed once on load
initializeLocalStorage();

/**
 * REGISTERED USERS STORAGE (REAL USERS ONLY)
 */
export function getRegisteredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!raw) return [];
  try {
    const list: StoredUser[] = JSON.parse(raw);
    return sanitizeUsers(list);
  } catch {
    return [];
  }
}

export function saveRegisteredUser(user: StoredUser): void {
  const users = getRegisteredUsers();
  const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.unshift(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function deleteRegisteredUser(userId: string): void {
  const users = getRegisteredUsers().filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // If current session is this user, sign out
  const current = localGetCurrentUser();
  if (current && current.id === userId) {
    localSignOut();
  }
}

/**
 * AUTHENTICATION (100% LOCAL STATE)
 */
export function localSignIn(email: string, password: string): { user: AuthUser | null; error: string | null } {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check hardcoded admin credentials
  if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
    if (password === ADMIN_CREDENTIALS.password) {
      const adminUser: AuthUser = {
        id: 'admin-root',
        email: ADMIN_CREDENTIALS.email,
        name: 'Anh Nguyen Tu',
        role: 'admin',
        score: 100,
        quizzesCompleted: 22,
        totalQuestionsAnswered: 110,
        totalCorrectAnswers: 110,
        password: ADMIN_CREDENTIALS.password
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(adminUser));
      return { user: adminUser, error: null };
    } else {
      return { user: null, error: 'Incorrect admin password.' };
    }
  }

  // 2. Regular user sign in from registered accounts
  const users = getRegisteredUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    return { 
      user: null, 
      error: 'Account not found. Please click "Create Account" below to register.' 
    };
  }

  if (found.password !== password) {
    return { user: null, error: 'Incorrect password. Please try again.' };
  }

  // Update last active
  found.lastActive = new Date().toISOString();
  saveRegisteredUser(found);

  const sessionUser: AuthUser = {
    id: found.id,
    email: found.email,
    name: found.name || found.email.split('@')[0],
    role: found.role,
    score: found.score || 0,
    quizzesCompleted: found.quizzesCompleted || 0,
    totalQuestionsAnswered: found.totalQuestionsAnswered || 0,
    totalCorrectAnswers: found.totalCorrectAnswers || 0,
    password: found.password
  };

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
  return { user: sessionUser, error: null };
}

export function localSignUp(email: string, password: string, name?: string): { user: AuthUser | null; error: string | null } {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { user: null, error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters.' };
  }

  // Check if admin email
  if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
    return localSignIn(cleanEmail, password);
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    return { user: null, error: 'An account with this email already exists. Please Sign In.' };
  }

  const displayName = name?.trim() || cleanEmail.split('@')[0];
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  const newUser: StoredUser = {
    id: 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    email: cleanEmail,
    name: formattedName,
    password: password,
    role: 'user',
    score: 0,
    quizzesCompleted: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  users.unshift(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const sessionUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: 'user',
    score: 0,
    quizzesCompleted: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    password: newUser.password
  };

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
  return { user: sessionUser, error: null };
}

export function localSignOut(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function localGetCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * SYLLABUS TOPICS
 */
export function getTopics(): Topic[] {
  if (typeof window === 'undefined') return SYLLABUS_TOPICS;
  const raw = localStorage.getItem(STORAGE_KEYS.TOPICS);
  return raw ? JSON.parse(raw) : SYLLABUS_TOPICS;
}

/**
 * QUESTIONS (LAZY LOCAL RETRIEVAL & MANAGEMENT)
 */
export async function getQuestionsByChapter(chapterId: string): Promise<Question[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  const questions: Question[] = raw ? JSON.parse(raw) : INITIAL_QUESTIONS;
  
  const matched = questions.filter((q) => q.topic_id === chapterId || q.subtopic_id === chapterId);
  if (matched.length > 0) return matched;

  // Fallback high-yield questions
  return [
    {
      id: `gen-q-${chapterId}-1`,
      topic_id: chapterId,
      subtopic_id: chapterId,
      question: `In Chapter ${chapterId}, what is the central biological mechanism governing this process?`,
      options: [
        'Enzyme-catalyzed biochemical reactions maintaining homeostatic balance',
        'Passive unregulated dissipation of thermal energy',
        'Direct abiotic synthesis without cellular organelles',
        'Indiscriminate cellular membrane lysis'
      ],
      correct_answer_index: 0,
      explanation: 'Biological functions in this curriculum chapter are mediated by specific enzyme-driven reactions and transport proteins.'
    },
    {
      id: `gen-q-${chapterId}-2`,
      topic_id: chapterId,
      subtopic_id: chapterId,
      question: `Which factor directly accelerates physiological efficiency in Chapter ${chapterId}?`,
      options: [
        'A large surface area to volume ratio minimizing diffusion distances',
        'Total absence of all water and cofactors',
        'Complete denaturation of protein tertiary active sites',
        'Extreme non-physiological temperatures'
      ],
      correct_answer_index: 0,
      explanation: 'Minimizing diffusion distances and maximizing surface area is the foundational evolutionary adaptation across all syllabus organ systems.'
    }
  ];
}

export function getAllQuestions(): Question[] {
  if (typeof window === 'undefined') return INITIAL_QUESTIONS;
  const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  return raw ? JSON.parse(raw) : INITIAL_QUESTIONS;
}

export function saveQuestion(question: Question): void {
  const questions = getAllQuestions();
  const idx = questions.findIndex((q) => q.id === question.id);
  if (idx >= 0) {
    questions[idx] = question;
  } else {
    questions.unshift(question);
  }
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

export function deleteQuestion(id: string): void {
  const questions = getAllQuestions().filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

/**
 * FLASHCARDS (LAZY LOCAL RETRIEVAL & MANAGEMENT)
 */
export async function getFlashcardsByChapter(chapterId: string): Promise<Flashcard[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
  const cards: Flashcard[] = raw ? JSON.parse(raw) : INITIAL_FLASHCARDS;

  const matched = cards.filter((fc) => fc.topic_id === chapterId || fc.subtopic_id === chapterId);
  if (matched.length > 0) return matched;

  return [
    {
      id: `gen-fc-${chapterId}-1`,
      topic_id: chapterId,
      subtopic_id: chapterId,
      term: `Chapter ${chapterId} Core Concept`,
      definition: 'The fundamental biological principle that dictates how cells and organisms regulate this system to sustain life.'
    },
    {
      id: `gen-fc-${chapterId}-2`,
      topic_id: chapterId,
      subtopic_id: chapterId,
      term: `Active Transport Mechanism`,
      definition: 'The energy-requiring movement of ions and molecules across a cell membrane against a concentration gradient using ATP.'
    }
  ];
}

export function getAllFlashcards(): Flashcard[] {
  if (typeof window === 'undefined') return INITIAL_FLASHCARDS;
  const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
  return raw ? JSON.parse(raw) : INITIAL_FLASHCARDS;
}

export function saveFlashcard(card: Flashcard): void {
  const cards = getAllFlashcards();
  const idx = cards.findIndex((c) => c.id === card.id);
  if (idx >= 0) {
    cards[idx] = card;
  } else {
    cards.unshift(card);
  }
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
}

export function deleteFlashcard(id: string): void {
  const cards = getAllFlashcards().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
}

/**
 * LEADERBOARD (DYNAMICALLY COMPUTED 100% FROM REAL REGISTERED USERS)
 * Strictly zero dummy users. Calculated directly from real users' actual scores and correct answers.
 */
export function getLeaderboard(): LeaderboardEntry[] {
  const users = getRegisteredUsers();

  // Include users who have actually taken quizzes or answered questions
  const activeLearners = users.filter((u) => u.quizzesCompleted > 0 || u.totalQuestionsAnswered > 0);

  const entries: LeaderboardEntry[] = activeLearners.map((u) => {
    const accuracy = u.totalQuestionsAnswered > 0
      ? Math.round((u.totalCorrectAnswers / u.totalQuestionsAnswered) * 100)
      : u.score;

    let badge = 'Active Learner';
    if (u.score >= 90) badge = 'High Achiever';
    else if (u.score >= 75) badge = 'Proficient';

    return {
      id: u.id,
      name: u.name || u.email.split('@')[0],
      email: u.email,
      score: u.score,
      quizzesCompleted: u.quizzesCompleted,
      accuracy,
      totalQuestionsAnswered: u.totalQuestionsAnswered,
      totalCorrectAnswers: u.totalCorrectAnswers,
      badge
    };
  });

  // Sort: primary by totalCorrectAnswers, secondary by highest score %, tertiary by quizzesCompleted
  entries.sort((a, b) => {
    if (b.totalCorrectAnswers !== a.totalCorrectAnswers) {
      return b.totalCorrectAnswers - a.totalCorrectAnswers;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.quizzesCompleted - a.quizzesCompleted;
  });

  return entries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1
  }));
}

/**
 * RECORD QUIZ COMPLETION
 * Updates chapter completion, user stats (total questions answered, total correct answers),
 * top score, and synchronizes the session user.
 */
export function recordQuizCompletion(
  chapterId: string, 
  scorePercent: number, 
  totalQuestions: number,
  correctCount: number,
  user: AuthUser | null
): void {
  if (typeof window === 'undefined') return;

  // 1. Save chapter progress
  const progressRaw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const progress = progressRaw ? JSON.parse(progressRaw) : {};
  progress[chapterId] = { completed: true, score: scorePercent };
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));

  // 2. If logged in, update real user record
  if (user) {
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(
      (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
    );

    let updatedUser: StoredUser;

    if (userIndex >= 0) {
      const existing = users[userIndex];
      const newQuizzes = (existing.quizzesCompleted || 0) + 1;
      const newTotalAnswered = (existing.totalQuestionsAnswered || 0) + totalQuestions;
      const newTotalCorrect = (existing.totalCorrectAnswers || 0) + correctCount;
      const newTopScore = Math.max(existing.score || 0, scorePercent);

      updatedUser = {
        ...existing,
        quizzesCompleted: newQuizzes,
        totalQuestionsAnswered: newTotalAnswered,
        totalCorrectAnswers: newTotalCorrect,
        score: newTopScore,
        lastActive: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
    } else {
      // User wasn't in users list yet (e.g. freshly created)
      updatedUser = {
        id: user.id || 'usr-' + Date.now().toString(36),
        email: user.email,
        name: user.name || user.email.split('@')[0],
        password: user.password || '******',
        role: user.role || 'user',
        score: scorePercent,
        quizzesCompleted: 1,
        totalQuestionsAnswered: totalQuestions,
        totalCorrectAnswers: correctCount,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      users.unshift(updatedUser);
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update active session
    const sessionAuth: AuthUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      score: updatedUser.score,
      quizzesCompleted: updatedUser.quizzesCompleted,
      totalQuestionsAnswered: updatedUser.totalQuestionsAnswered,
      totalCorrectAnswers: updatedUser.totalCorrectAnswers,
      password: updatedUser.password
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionAuth));
  }
}

/**
 * FEEDBACKS (LOCAL STORAGE)
 */
export function getFeedbacks(): Feedback[] {
  if (typeof window === 'undefined') return INITIAL_FEEDBACKS;
  const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
  return raw ? JSON.parse(raw) : INITIAL_FEEDBACKS;
}

export function saveFeedback(fb: Omit<Feedback, 'id' | 'created_at'>): Feedback {
  const feedbacks = getFeedbacks();
  const newFeedback: Feedback = {
    ...fb,
    id: 'fb-' + Date.now().toString(36),
    created_at: new Date().toISOString()
  };
  feedbacks.unshift(newFeedback);
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  return newFeedback;
}

export function deleteFeedback(id: string): void {
  const feedbacks = getFeedbacks().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
}
