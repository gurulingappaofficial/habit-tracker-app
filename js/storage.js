// ============================================
// storage.js — LocalStorage Data Layer
// ============================================

const STORAGE_KEYS = {
  HABITS: 'ht_habits',
  PROGRESS: 'ht_progress',
  DARK_MODE: 'ht_darkMode',
  FIRST_RUN: 'ht_firstRun',
  USER: 'ht_user'
};

// ---------- Default Habits ----------
const DEFAULT_HABITS = [
  {
    id: 1,
    name: 'Drink Water',
    description: '8 glasses daily',
    category: 'Health',
    icon: '💧',
    completedDates: [],
    streak: 0
  },
  {
    id: 2,
    name: 'Study 2 Hours',
    description: 'Focus on learning',
    category: 'Education',
    icon: '📚',
    completedDates: [],
    streak: 0
  },
  {
    id: 3,
    name: 'Exercise',
    description: '30 min workout',
    category: 'Fitness',
    icon: '🏋️',
    completedDates: [],
    streak: 0
  },
  {
    id: 4,
    name: 'Read a Book',
    description: '20 pages minimum',
    category: 'Education',
    icon: '📖',
    completedDates: [],
    streak: 0
  }
];

// ---------- Helpers ----------
function getTodayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function getDateStr(date) {
  return date.toISOString().split('T')[0];
}

// ---------- Habits CRUD ----------
function getHabits() {
  const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
  return raw ? JSON.parse(raw) : [];
}

function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

function addHabit(habit) {
  const habits = getHabits();
  habit.id = Date.now();
  habit.completedDates = [];
  habit.streak = 0;
  habits.push(habit);
  saveHabits(habits);
  return habit;
}

function deleteHabit(id) {
  let habits = getHabits();
  habits = habits.filter(h => h.id !== id);
  saveHabits(habits);

  // Also clean progress
  const progress = getProgress();
  Object.keys(progress).forEach(date => {
    progress[date] = progress[date].filter(hId => hId !== id);
    if (progress[date].length === 0) delete progress[date];
  });
  saveProgress(progress);
}

function updateHabit(id, updates) {
  const habits = getHabits();
  const idx = habits.findIndex(h => h.id === id);
  if (idx !== -1) {
    habits[idx] = { ...habits[idx], ...updates };
    saveHabits(habits);
  }
}

// ---------- User ----------
function getUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

// ---------- Progress ----------
function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return raw ? JSON.parse(raw) : {};
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

function toggleHabitComplete(habitId) {
  const today = getTodayStr();
  const progress = getProgress();
  if (!progress[today]) progress[today] = [];

  const idx = progress[today].indexOf(habitId);
  let completed = false;
  if (idx === -1) {
    progress[today].push(habitId);
    completed = true;
  } else {
    progress[today].splice(idx, 1);
    completed = false;
  }
  saveProgress(progress);

  // Update streak & completedDates on habit
  const habits = getHabits();
  const habit = habits.find(h => h.id === habitId);
  if (habit) {
    if (completed) {
      if (!habit.completedDates.includes(today)) {
        habit.completedDates.push(today);
      }
    } else {
      habit.completedDates = habit.completedDates.filter(d => d !== today);
    }
    habit.streak = calculateStreak(habit.completedDates);
    saveHabits(habits);
  }

  return completed;
}

function isHabitCompletedToday(habitId) {
  const progress = getProgress();
  const today = getTodayStr();
  return (progress[today] || []).includes(habitId);
}

function getTodayCompletedCount() {
  const progress = getProgress();
  const today = getTodayStr();
  return (progress[today] || []).length;
}

// ---------- Streak Calculation ----------
function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const today = getTodayStr();
  const yesterday = getDateStr(new Date(Date.now() - 86400000));

  // Streak must include today or yesterday to be active
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ---------- Analytics Helpers ----------
function getBestStreak() {
  const habits = getHabits();
  let best = 0;
  habits.forEach(h => {
    if (h.streak > best) best = h.streak;
  });
  return best;
}

function getSuccessRate() {
  const habits = getHabits();
  if (habits.length === 0) return 0;
  const completed = getTodayCompletedCount();
  return Math.round((completed / habits.length) * 100);
}

function getWeeklyData() {
  const progress = getProgress();
  const data = [];
  const labels = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getDateStr(d);
    labels.push(dayNames[d.getDay()]);
    data.push((progress[dateStr] || []).length);
  }
  return { labels, data };
}

function getLast30DaysData() {
  const progress = getProgress();
  const data = [];
  const labels = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getDateStr(d);
    labels.push(d.getDate().toString());
    data.push((progress[dateStr] || []).length);
  }
  return { labels, data };
}

function getCompletedForDate(dateStr) {
  const progress = getProgress();
  const habitIds = progress[dateStr] || [];
  const habits = getHabits();
  return habitIds.map(id => habits.find(h => h.id === id)).filter(Boolean);
}

function getCompletionLevelForDate(dateStr) {
  const progress = getProgress();
  const habits = getHabits();
  const completed = (progress[dateStr] || []).length;
  if (habits.length === 0 || completed === 0) return 'none';
  if (completed >= habits.length) return 'full';
  return 'partial';
}

// ---------- Dark Mode ----------
function getDarkMode() {
  return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
}

function setDarkMode(val) {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, val.toString());
}

function applyDarkMode() {
  if (getDarkMode()) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// ---------- Reset ----------
function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.FIRST_RUN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ---------- Init ----------
function initStorage() {
  applyDarkMode();
  const firstRun = localStorage.getItem(STORAGE_KEYS.FIRST_RUN);
  if (!firstRun) {
    saveHabits(DEFAULT_HABITS);
    localStorage.setItem(STORAGE_KEYS.FIRST_RUN, 'done');
  }
}
