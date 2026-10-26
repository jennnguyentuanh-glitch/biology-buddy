export type Mode = 'quiz' | 'flashcards' | 'leaderboard';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
  score?: number;
  quizzesCompleted?: number;
  totalQuestionsAnswered?: number;
  totalCorrectAnswers?: number;
  password?: string;
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  score: number;
  quizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  createdAt: string;
  lastActive: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  score: number;
  quizzesCompleted: number;
  accuracy: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  rank?: number;
  badge?: string;
}

export interface Subtopic {
  id: string; // e.g. "1.1"
  topic_id: string; // e.g. "topic-1"
  code: string; // e.g. "1.1"
  title: string; // e.g. "Life Processes"
  estimated_minutes: number;
  question_count?: number;
  flashcard_count?: number;
  completed?: boolean;
  score?: number; // e.g. 85%
}

export interface Topic {
  id: string; // e.g. "topic-1"
  number: number;
  title: string;
  subtopics: Subtopic[];
}

export interface Question {
  id: string;
  topic_id: string; // references Subtopic.id e.g. "1.1"
  subtopic_id: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Flashcard {
  id: string;
  topic_id: string; // references Subtopic.id e.g. "1.1"
  subtopic_id: string;
  term: string;
  definition: string;
  category?: string;
  mastered?: boolean;
}

export interface SubtopicNote {
  id: string;
  topic_id: string;
  subtopic_id: string;
  summary: string;
  key_points: string[];
  common_mistakes: string[];
  exam_tip: string;
}

export interface PastPaperQuestion {
  id: string;
  topic_id: string;
  subtopic_id: string;
  year: string;
  paper: string;
  question_text: string;
  marks: number;
  mark_scheme: string[];
  guidance: string;
}

export interface Feedback {
  id: string;
  user_email: string;
  category: 'bug' | 'content' | 'feature' | 'general';
  message: string;
  rating?: number;
  created_at: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'student' | 'admin';
  progress: Record<string, { completed: boolean; score?: number }>;
}

export interface QuizAttempt {
  id: string;
  subtopic_id: string;
  score: number;
  timestamp: string;
}

export interface WeeklyScoreData {
  week: string;
  label: string;
  score: number;
  target: number;
  quizzes: number;
}

export interface TopicMasteryData {
  topicName: string;
  shortName: string;
  mastered: number;
  inProgress: number;
  unstudied: number;
  averageScore: number;
  totalSubtopics: number;
  completedSubtopics: number;
}

