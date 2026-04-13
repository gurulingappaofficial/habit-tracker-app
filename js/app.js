// ============================================
// app.js — Home Page Logic
// ============================================

const QUOTES = [
  "Small steps every day lead to big results. 🚀",
  "Discipline is the bridge between goals and accomplishment.",
  "Success is the sum of small efforts repeated daily.",
  "You don't have to be extreme, just consistent. 💪",
  "The secret of getting ahead is getting started.",
  "Believe you can, and you're halfway there.",
  "Your only limit is you.",
  "Make each day your masterpiece. ✨",
  "Progress, not perfection.",
  "Dream big, start small, act now."
];

let activeFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  setGreeting();
  setQuote();
  renderCategoryFilter();
  renderHabits();
  updateProgress();
  bindModal();
});

// ---------- Greeting ----------
function setGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greet = 'Good Evening!';
  if (hour < 12) greet = 'Good Morning! ☀️';
  else if (hour < 17) greet = 'Good Afternoon! 🌤️';
  else greet = 'Good Evening! 🌙';

  const user = getUser();
  const firstName = user ? user.name.split(' ')[0] : '';
  const greetingText = firstName ? `${greet.replace(/!.*$/, '')}, ${firstName}! ${greet.includes(' ') ? greet.split(' ').pop() : ''}` : greet;

  document.getElementById('headerGreeting').textContent = greetingText.trim();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('headerDate').textContent = now.toLocaleDateString('en-US', options);
}

// ---------- Motivational Quote ----------
function setQuote() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('quoteBar').textContent = `"${q}"`;
}

// ---------- Category Filter ----------
function renderCategoryFilter() {
  const habits = getHabits();
  const categories = ['All', ...new Set(habits.map(h => h.category))];
  const container = document.getElementById('categoryFilter');
  container.innerHTML = '';

  categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = `filter-chip${cat === activeFilter ? ' active' : ''}`;
    chip.textContent = cat;
    chip.addEventListener('click', () => {
      activeFilter = cat;
      renderCategoryFilter();
      renderHabits();
    });
    container.appendChild(chip);
  });
}

// ---------- Render Habits ----------
function renderHabits() {
  const habits = getHabits();
  const container = document.getElementById('habitList');
  container.innerHTML = '';

  const filtered = activeFilter === 'All'
    ? habits
    : habits.filter(h => h.category === activeFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state fade-in">
        <div class="empty-icon">📋</div>
        <p>No habits yet. Tap + to add one!</p>
      </div>`;
    return;
  }

  filtered.forEach(habit => {
    const done = isHabitCompletedToday(habit.id);
    const card = document.createElement('div');
    card.className = `habit-card${done ? ' completed' : ''}`;

    card.innerHTML = `
      <div class="habit-check${done ? ' checked' : ''}" data-id="${habit.id}"></div>
      <div class="habit-icon">${habit.icon || '✅'}</div>
      <div class="habit-info">
        <div class="habit-name">${escapeHtml(habit.name)}</div>
        <div class="habit-desc">${escapeHtml(habit.description)}</div>
        <div class="habit-meta">
          <span class="habit-category">${escapeHtml(habit.category)}</span>
          ${habit.streak > 0 ? `<span class="habit-streak">🔥 ${habit.streak}</span>` : ''}
        </div>
      </div>
      <button class="habit-delete" data-id="${habit.id}" aria-label="Delete habit">🗑️</button>
    `;

    // Check / uncheck
    card.querySelector('.habit-check').addEventListener('click', (e) => {
      e.stopPropagation();
      const completed = toggleHabitComplete(habit.id);
      if (completed) playCompletionEffect(card);
      renderHabits();
      renderCategoryFilter();
      updateProgress();
    });

    // Delete
    card.querySelector('.habit-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.add('deleting');
      setTimeout(() => {
        deleteHabit(habit.id);
        renderHabits();
        renderCategoryFilter();
        updateProgress();
      }, 400);
    });

    container.appendChild(card);
  });
}

// ---------- Progress Bar ----------
function updateProgress() {
  const habits = getHabits();
  const total = habits.length;
  const done = getTodayCompletedCount();
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('progressText').textContent = `${done}/${total}`;
  document.getElementById('progressBar').style.width = `${pct}%`;
}

// ---------- Modal Data ----------
const CATEGORIES = [
  { name: 'Health', icon: '💧' },
  { name: 'Study', icon: '📚' },
  { name: 'Fitness', icon: '🏋️' },
  { name: 'Personal', icon: '✨' },
  { name: 'Productivity', icon: '⚡' },
  { name: 'Social', icon: '🤝' },
  { name: 'Other', icon: '🌟' }
];

const MODAL_ICONS = [
  '💧', '📚', '🏋️', '📖', '🧘', '🏃', '💤', '🥗', '✍️', '🎯', '💡', '🎨', '🚀', '🚲', '🎵'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let selectedCategory = 'Health';
let selectedIcon = MODAL_ICONS[0];
let selectedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---------- Modal ----------
function bindModal() {
  const overlay = document.getElementById('modalOverlay');
  const fab = document.getElementById('fabAdd');
  const cancelBtn = document.getElementById('btnCancel');
  const saveBtn = document.getElementById('btnSave');

  fab.addEventListener('click', () => {
    overlay.classList.add('active');
    initModalSelectors();
  });

  cancelBtn.addEventListener('click', () => closeModal());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  saveBtn.addEventListener('click', () => {
    const name = document.getElementById('habitName').value.trim();
    const desc = document.getElementById('habitDesc').value.trim();
    const category = selectedCategory;
    const icon = selectedIcon;

    if (!name) {
      document.getElementById('habitName').style.borderColor = '#EF4444';
      document.getElementById('habitName').focus();
      return;
    }

    addHabit({ 
      name, 
      description: desc, 
      category, 
      icon, 
      targetDays: [...selectedDays] 
    });
    
    closeModal();
    renderCategoryFilter();
    renderHabits();
    updateProgress();
  });
}

function initModalSelectors() {
  renderCategoryChips();
  renderIconGrid();
  renderDayChips();
}

function renderCategoryChips() {
  const container = document.getElementById('categoryChips');
  container.innerHTML = '';
  
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('div');
    chip.className = `chip${selectedCategory === cat.name ? ' active' : ''}`;
    chip.innerHTML = `<span>${cat.icon}</span> ${cat.name}`;
    chip.addEventListener('click', () => {
      selectedCategory = cat.name;
      renderCategoryChips();
    });
    container.appendChild(chip);
  });
}

function renderIconGrid() {
  const container = document.getElementById('iconGrid');
  container.innerHTML = '';
  
  MODAL_ICONS.forEach(icon => {
    const circle = document.createElement('div');
    circle.className = `icon-circle${selectedIcon === icon ? ' active' : ''}`;
    circle.textContent = icon;
    circle.addEventListener('click', () => {
      selectedIcon = icon;
      renderIconGrid();
    });
    container.appendChild(circle);
  });
}

function renderDayChips() {
  const container = document.getElementById('dayChips');
  container.innerHTML = '';
  
  const dailyBtn = document.getElementById('dailyBtn');
  dailyBtn.className = `day-chip${selectedDays.length === 7 ? ' active' : ''}`;
  
  dailyBtn.onclick = () => {
    if (selectedDays.length === 7) {
      selectedDays = [];
    } else {
      selectedDays = [...DAYS];
    }
    renderDayChips();
  };

  DAYS.forEach(day => {
    const chip = document.createElement('div');
    chip.className = `day-chip${selectedDays.includes(day) ? ' active' : ''}`;
    chip.textContent = day;
    chip.addEventListener('click', () => {
      if (selectedDays.includes(day)) {
        selectedDays = selectedDays.filter(d => d !== day);
      } else {
        selectedDays.push(day);
      }
      renderDayChips();
    });
    container.appendChild(chip);
  });
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.getElementById('habitName').value = '';
  document.getElementById('habitDesc').value = '';
  document.getElementById('habitName').style.borderColor = '';
  
  selectedCategory = 'Health';
  selectedIcon = MODAL_ICONS[0];
  selectedDays = [...DAYS];
}


// ---------- Completion Effect ----------
function playCompletionEffect(card) {
  // Mini confetti
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#6366F1', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899', '#3B82F6'];
  const rect = card.getBoundingClientRect();

  for (let i = 0; i < 18; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 80}px`;
    piece.style.top = `${rect.top + rect.height / 2}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${0.6 + Math.random() * 0.8}s`;
    piece.style.transform = `translateX(${(Math.random() - 0.5) * 120}px)`;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 1500);
}

// ---------- Utility ----------
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
