import React, { useState, useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  Layers, 
  Trash2, 
  Plus, 
  Trophy, 
  Lock, 
  Check, 
  Search, 
  Shield, 
  Edit2, 
  Users, 
  Eye, 
  EyeOff, 
  Copy, 
  UserPlus, 
  MessageSquare 
} from 'lucide-react';
import { Question, Flashcard, Feedback, Topic, LeaderboardEntry, AuthUser, StoredUser } from '../types';
import { 
  ADMIN_CREDENTIALS,
  getAllQuestions, 
  saveQuestion, 
  deleteQuestion, 
  getAllFlashcards, 
  saveFlashcard, 
  deleteFlashcard, 
  getFeedbacks, 
  deleteFeedback,
  getLeaderboard,
  getRegisteredUsers,
  saveRegisteredUser,
  deleteRegisteredUser
} from '../lib/storage';

interface AdminPortalProps {
  topics: Topic[];
  currentUser: AuthUser | null;
  onClose: () => void;
  onAdminLoginSuccess: (adminUser: AuthUser) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ 
  topics, 
  currentUser,
  onClose,
  onAdminLoginSuccess
}) => {
  // Authentication check
  const isAlreadyAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();
  const [isAuthenticated, setIsAuthenticated] = useState(isAlreadyAdmin);
  const [adminEmail, setAdminEmail] = useState(ADMIN_CREDENTIALS.email);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tabs: 'users' | 'questions' | 'flashcards' | 'leaderboard' | 'feedbacks'
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'flashcards' | 'leaderboard' | 'feedbacks'>('users');

  // Data states
  const [registeredUsers, setRegisteredUsers] = useState<StoredUser[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);
  const [hiddenPasswords, setHiddenPasswords] = useState<Record<string, boolean>>({});

  // Add User manual form
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userFormError, setUserFormError] = useState('');

  // Add / Edit Question modal or inline form
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qChapterId, setQChapterId] = useState('1');
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  // Add / Edit Flashcard inline form
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardChapterId, setCardChapterId] = useState('1');
  const [cardTerm, setCardTerm] = useState('');
  const [cardDef, setCardDef] = useState('');

  const refreshData = () => {
    setRegisteredUsers(getRegisteredUsers());
    setQuestions(getAllQuestions());
    setFlashcards(getAllFlashcards());
    setFeedbacks(getFeedbacks());
    setLeaderboard(getLeaderboard());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      adminPassword === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setAuthError('');
      const adminUser: AuthUser = {
        id: 'admin-root',
        email: ADMIN_CREDENTIALS.email,
        name: 'Anh Nguyen Tu (Admin)',
        role: 'admin',
        score: 100,
        quizzesCompleted: 22,
        totalQuestionsAnswered: 110,
        totalCorrectAnswers: 110
      };
      onAdminLoginSuccess(adminUser);
      refreshData();
    } else {
      setAuthError('Invalid credentials. Please enter email: nguyentuanh.jenn@gmail.com and password: 135246');
    }
  };

  // User Management Handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    const cleanEmail = newUserEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setUserFormError('Please enter a valid email address.');
      return;
    }

    if (!newUserPassword || newUserPassword.length < 6) {
      setUserFormError('Password must be at least 6 characters.');
      return;
    }

    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setUserFormError('An account with this email already exists.');
      return;
    }

    const name = newUserName.trim() || cleanEmail.split('@')[0];
    const newUser: StoredUser = {
      id: 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      email: cleanEmail,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      password: newUserPassword,
      role: 'user',
      score: 0,
      quizzesCompleted: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    saveRegisteredUser(newUser);
    refreshData();
    setIsAddingUser(false);
    setNewUserEmail('');
    setNewUserName('');
    setNewUserPassword('');
  };

  const handleDeleteUser = (user: StoredUser) => {
    if (user.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() || user.role === 'admin') {
      alert('The root Admin account cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete account ${user.email}? This will erase their quiz progress and leaderboard standing.`)) {
      deleteRegisteredUser(user.id);
      refreshData();
    }
  };

  const copyPassword = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedPassId(id);
    setTimeout(() => setCopiedPassId(null), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setHiddenPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Questions Handlers
  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || qOptions.some((o) => !o.trim())) return;

    const newQuestion: Question = {
      id: editingQuestionId || 'q-' + Date.now().toString(36),
      topic_id: qChapterId,
      subtopic_id: qChapterId,
      question: qText.trim(),
      options: qOptions.map((o) => o.trim()),
      correct_answer_index: qCorrect,
      explanation: qExplanation.trim() || 'Official curriculum mark scheme explanation.'
    };

    saveQuestion(newQuestion);
    refreshData();
    setIsAddingQuestion(false);
    setEditingQuestionId(null);
    setQText('');
    setQOptions(['', '', '', '']);
    setQExplanation('');
  };

  const handleStartEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQChapterId(q.topic_id || q.subtopic_id || '1');
    setQText(q.question);
    setQOptions([...q.options]);
    setQCorrect(q.correct_answer_index);
    setQExplanation(q.explanation || '');
    setIsAddingQuestion(true);
  };

  const handleDeleteQ = (id: string) => {
    if (confirm('Delete this question from local database?')) {
      deleteQuestion(id);
      refreshData();
    }
  };

  // Flashcards Handlers
  const handleSaveCardForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTerm.trim() || !cardDef.trim()) return;

    const newCard: Flashcard = {
      id: editingCardId || 'fc-' + Date.now().toString(36),
      topic_id: cardChapterId,
      subtopic_id: cardChapterId,
      term: cardTerm.trim(),
      definition: cardDef.trim()
    };

    saveFlashcard(newCard);
    refreshData();
    setIsAddingCard(false);
    setEditingCardId(null);
    setCardTerm('');
    setCardDef('');
  };

  const handleStartEditCard = (c: Flashcard) => {
    setEditingCardId(c.id);
    setCardChapterId(c.topic_id || c.subtopic_id || '1');
    setCardTerm(c.term);
    setCardDef(c.definition);
    setIsAddingCard(true);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm('Delete this flashcard?')) {
      deleteFlashcard(id);
      refreshData();
    }
  };

  const handleDeleteFb = (id: string) => {
    deleteFeedback(id);
    refreshData();
  };

  // Helper: flatten all 22 chapters
  const allChapters = topics.flatMap((t) => t.subtopics);

  // Filtered lists
  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuestions = questions.filter(
    (q) => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic_id.includes(searchQuery)
  );

  const filteredCards = flashcards.filter(
    (c) =>
      c.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topic_id.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Expanded Modal Size: w-[95%] max-w-7xl h-[90vh] with dark mode support */}
      <div className="bg-white dark:bg-slate-900 w-[95%] max-w-7xl h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">Bioo Admin Dashboard</h2>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  · Local State Manager
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Manage live student accounts, curriculum questions, flashcards, and feedbacks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 hidden md:inline">
              Admin: {ADMIN_CREDENTIALS.email}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-6 flex-1 flex flex-col justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Authentication Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Enter administrator credentials to inspect registered student accounts, manage passwords, and edit syllabus content.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg text-left">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="nguyentuanh.jenn@gmail.com"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password (135246)"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  Sign In to Dashboard
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sub-nav Tabs & Search bar */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'users', label: 'Registered Accounts', count: registeredUsers.length, icon: Users },
                  { id: 'questions', label: 'Quiz Questions', count: questions.length, icon: HelpCircle },
                  { id: 'flashcards', label: 'Flashcards', count: flashcards.length, icon: Layers },
                  { id: 'leaderboard', label: 'Live Rankings', count: leaderboard.length, icon: Trophy },
                  { id: 'feedbacks', label: 'Student Feedbacks', count: feedbacks.length, icon: MessageSquare }
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive 
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 shadow-2xs placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#F8FAF9] dark:bg-slate-950 transition-colors">
              
              {/* ==================== 1. USERS TAB ==================== */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Real Registered Accounts</span>
                        <span className="text-xs font-normal text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          Live Local State Only (0 Dummy Data)
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Track students who registered, view passwords directly, and review real question answers & quiz completion
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingUser(!isAddingUser);
                        setUserFormError('');
                      }}
                      className="px-3.5 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isAddingUser ? 'Close Form' : 'Register New Student'}</span>
                    </button>
                  </div>

                  {/* Manual Add User Form */}
                  {isAddingUser && (
                    <form onSubmit={handleCreateUser} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-100">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">
                          Create New User Account (Client-side)
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Creates account immediately in local storage</span>
                      </div>

                      {userFormError && (
                        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-md">
                          {userFormError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Full Name / Username
                          </label>
                          <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="e.g. Liam Smith"
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="student@school.edu"
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Password (Min. 6 chars) *
                          </label>
                          <input
                            type="text"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            placeholder="Set account password"
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 font-mono"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddingUser(false)}
                          className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold rounded-md hover:bg-slate-800 dark:hover:bg-emerald-500 cursor-pointer"
                        >
                          Save Account
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Users Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3">Username / Email</th>
                            <th className="px-5 py-3">Password (Admin Visibility)</th>
                            <th className="px-5 py-3 text-center">Completed Quizzes</th>
                            <th className="px-5 py-3 text-center">Questions Answered</th>
                            <th className="px-5 py-3 text-center">Top Score</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                                {searchQuery ? 'No accounts matched your search.' : 'No registered student accounts yet. Real users who sign up will automatically appear here.'}
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => {
                              const isRootAdmin = user.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();
                              const isHidden = hiddenPasswords[user.id] === true;

                              return (
                                <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                  {/* Username / Email */}
                                  <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                                        isRootAdmin 
                                          ? 'bg-slate-900 dark:bg-slate-700 text-white' 
                                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60'
                                      }`}>
                                        {user.name.charAt(0) || user.email.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                          <span>{user.name}</span>
                                          {isRootAdmin ? (
                                            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">
                                              ADMIN
                                            </span>
                                          ) : (
                                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                                              STUDENT
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                                          {user.email}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Password (Visible for Admin inspection as requested) */}
                                  <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2 font-mono">
                                      <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded border border-slate-200/90 dark:border-slate-700 text-xs font-semibold tracking-wide flex items-center gap-2">
                                        <span>{isHidden ? '••••••••' : (user.password || '135246')}</span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility(user.id)}
                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                        title={isHidden ? 'Show Password' : 'Mask Password'}
                                      >
                                        {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => copyPassword(user.password || '135246', user.id)}
                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                        title="Copy Password"
                                      >
                                        {copiedPassId === user.id ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </td>

                                  {/* Completed Quizzes */}
                                  <td className="px-5 py-3.5 text-center font-mono">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{user.quizzesCompleted || 0}</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1">quizzes</span>
                                  </td>

                                  {/* Total Questions Answered / Correct */}
                                  <td className="px-5 py-3.5 text-center font-mono">
                                    <div className="flex flex-col items-center">
                                      <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {user.totalQuestionsAnswered || 0} answered
                                      </span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {user.totalCorrectAnswers || 0} correct ({
                                          user.totalQuestionsAnswered 
                                            ? Math.round(((user.totalCorrectAnswers || 0) / user.totalQuestionsAnswered) * 100)
                                            : 0
                                        }%)
                                      </span>
                                    </div>
                                  </td>

                                  {/* Top Score */}
                                  <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-900 dark:text-white">
                                    {user.score ? `${user.score}%` : '—'}
                                  </td>

                                  {/* Actions */}
                                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                    {isRootAdmin ? (
                                      <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">Protected</span>
                                    ) : (
                                      <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
                                        title="Delete User Account"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
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
              )}

              {/* ==================== 2. QUESTIONS TAB ==================== */}
              {activeTab === 'questions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Curriculum Quiz Questions</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Edit, add, or remove multiple choice questions across all 22 syllabus chapters</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingQuestion(!isAddingQuestion);
                        setEditingQuestionId(null);
                        setQText('');
                        setQOptions(['', '', '', '']);
                        setQExplanation('');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingQuestion ? 'Close Form' : 'Add New Question'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Form */}
                  {isAddingQuestion && (
                    <form onSubmit={handleSaveQuestionForm} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-100">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                        {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Target Chapter</label>
                          <select
                            value={qChapterId}
                            onChange={(e) => setQChapterId(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                          >
                            {allChapters.map((c) => (
                              <option key={c.id} value={c.id}>
                                Chapter {c.code}: {c.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Correct Answer</label>
                          <select
                            value={qCorrect}
                            onChange={(e) => setQCorrect(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 font-semibold text-emerald-800 dark:text-emerald-400"
                          >
                            <option value={0}>Option A is Correct</option>
                            <option value={1}>Option B is Correct</option>
                            <option value={2}>Option C is Correct</option>
                            <option value={3}>Option D is Correct</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Question Prompt</label>
                        <input
                          type="text"
                          value={qText}
                          onChange={(e) => setQText(e.target.value)}
                          placeholder="e.g. Which organelle is the site of aerobic cellular respiration?"
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {qOptions.map((opt, idx) => (
                          <div key={idx} className={idx === qCorrect ? 'p-1.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800' : ''}>
                            <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                              Option {String.fromCharCode(65 + idx)} {idx === qCorrect && '(Correct Answer)'}
                            </label>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const copy = [...qOptions];
                                copy[idx] = e.target.value;
                                setQOptions(copy);
                              }}
                              placeholder={`Option ${String.fromCharCode(65 + idx)}...`}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Explanation (Mark Scheme Notes)</label>
                        <input
                          type="text"
                          value={qExplanation}
                          onChange={(e) => setQExplanation(e.target.value)}
                          placeholder="Scientific explanation displayed upon answer submission..."
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingQuestion(false);
                            setEditingQuestionId(null);
                          }}
                          className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold rounded-md hover:bg-slate-800 dark:hover:bg-emerald-500 cursor-pointer"
                        >
                          {editingQuestionId ? 'Update Question' : 'Save Question'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Questions Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3 w-16">Ch</th>
                            <th className="px-5 py-3">Question Prompt</th>
                            <th className="px-5 py-3">Correct Answer</th>
                            <th className="px-5 py-3 w-24 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {filteredQuestions.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                                No questions found.
                              </td>
                            </tr>
                          ) : (
                            filteredQuestions.map((q) => (
                              <tr key={q.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-5 py-3 font-mono text-slate-600 dark:text-slate-400 font-bold">
                                  Ch {q.topic_id || q.subtopic_id}
                                </td>
                                <td className="px-5 py-3 font-medium text-slate-900 dark:text-white max-w-md">
                                  {q.question}
                                </td>
                                <td className="px-5 py-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                                  {q.options[q.correct_answer_index]}
                                </td>
                                <td className="px-5 py-3 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleStartEditQuestion(q)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mr-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                    title="Edit Question"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQ(q.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    title="Delete Question"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== 3. FLASHCARDS TAB ==================== */}
              {activeTab === 'flashcards' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Revision Flashcards</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Edit, add, or remove key terms and biological definitions</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingCard(!isAddingCard);
                        setEditingCardId(null);
                        setCardTerm('');
                        setCardDef('');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingCard ? 'Close Form' : 'New Flashcard'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Card Form */}
                  {isAddingCard && (
                    <form onSubmit={handleSaveCardForm} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-100">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                        {editingCardId ? 'Edit Flashcard' : 'Add New Flashcard'}
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Target Chapter</label>
                        <select
                          value={cardChapterId}
                          onChange={(e) => setCardChapterId(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                        >
                          {allChapters.map((c) => (
                            <option key={c.id} value={c.id}>
                              Chapter {c.code}: {c.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Term (Front of Card)</label>
                        <input
                          type="text"
                          value={cardTerm}
                          onChange={(e) => setCardTerm(e.target.value)}
                          placeholder="e.g. Homeostasis"
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Definition (Back of Card)</label>
                        <textarea
                          rows={3}
                          value={cardDef}
                          onChange={(e) => setCardDef(e.target.value)}
                          placeholder="Scientific definition..."
                          className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCard(false);
                            setEditingCardId(null);
                          }}
                          className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold rounded-md hover:bg-slate-800 dark:hover:bg-emerald-500 cursor-pointer"
                        >
                          {editingCardId ? 'Update Flashcard' : 'Save Flashcard'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Flashcards Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3 w-16">Ch</th>
                            <th className="px-5 py-3 w-48">Term</th>
                            <th className="px-5 py-3">Definition</th>
                            <th className="px-5 py-3 w-24 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {filteredCards.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                                No flashcards found.
                              </td>
                            </tr>
                          ) : (
                            filteredCards.map((c) => (
                              <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-5 py-3 font-mono text-slate-500 dark:text-slate-400 font-bold">
                                  Ch {c.topic_id || c.subtopic_id}
                                </td>
                                <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">
                                  {c.term}
                                </td>
                                <td className="px-5 py-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {c.definition}
                                </td>
                                <td className="px-5 py-3 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleStartEditCard(c)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mr-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                    title="Edit Flashcard"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCard(c.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    title="Delete Flashcard"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== 4. LEADERBOARD TAB ==================== */}
              {activeTab === 'leaderboard' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Dynamic Leaderboard</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Calculated solely and dynamically from real users who have taken quizzes. Zero dummy users.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3 w-16">Rank</th>
                            <th className="px-5 py-3">Student</th>
                            <th className="px-5 py-3 text-center">Quizzes Completed</th>
                            <th className="px-5 py-3 text-center">Questions Answered</th>
                            <th className="px-5 py-3 text-center">Avg Accuracy</th>
                            <th className="px-5 py-3 text-right">Top Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {leaderboard.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                                No quiz completions yet. Real student scores will appear here after taking quizzes.
                              </td>
                            </tr>
                          ) : (
                            leaderboard.map((item, idx) => (
                              <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-5 py-3 font-mono font-bold text-slate-600 dark:text-slate-400">
                                  #{idx + 1}
                                </td>
                                <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">
                                  {item.name} <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">({item.email})</span>
                                </td>
                                <td className="px-5 py-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                                  {item.quizzesCompleted}
                                </td>
                                <td className="px-5 py-3 text-center font-mono">
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.totalCorrectAnswers || 0}</span>
                                  <span className="text-slate-400 dark:text-slate-500 text-[11px]"> / {item.totalQuestionsAnswered || 0}</span>
                                </td>
                                <td className="px-5 py-3 text-center font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                                  {item.accuracy}%
                                </td>
                                <td className="px-5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white text-sm">
                                  {item.score}%
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== 5. FEEDBACKS TAB ==================== */}
              {activeTab === 'feedbacks' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Feedback Submissions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Collected locally from the floating bottom-left Feedback button</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3 w-28">Date</th>
                            <th className="px-5 py-3 w-48">Sender Email</th>
                            <th className="px-5 py-3 w-28">Category</th>
                            <th className="px-5 py-3">Message</th>
                            <th className="px-5 py-3 w-20 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {feedbacks.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                                No feedbacks submitted yet.
                              </td>
                            </tr>
                          ) : (
                            feedbacks.map((fb) => (
                              <tr key={fb.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-5 py-3 font-mono text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                  {new Date(fb.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                                  {fb.user_email}
                                </td>
                                <td className="px-5 py-3">
                                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide">
                                    {fb.category}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-slate-700 dark:text-slate-300 leading-relaxed max-w-md">
                                  {fb.message}
                                </td>
                                <td className="px-5 py-3 text-right">
                                  <button
                                    onClick={() => handleDeleteFb(fb.id)}
                                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                    title="Delete feedback"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
