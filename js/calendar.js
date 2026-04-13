// ============================================
// calendar.js — Calendar Page Logic
// ============================================

let currentYear;
let currentMonth;

document.addEventListener('DOMContentLoaded', () => {
  initStorage();

  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();

  renderCalendar();

  document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
    closeDayDetail();
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
    closeDayDetail();
  });
});

function renderCalendar() {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  document.getElementById('monthLabel').textContent = `${monthNames[currentMonth]} ${currentYear}`;

  const container = document.getElementById('calendarDays');
  container.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  const todayStr = getTodayStr();

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('button');
    cell.className = 'calendar-day empty';
    cell.disabled = true;
    container.appendChild(cell);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const level = getCompletionLevelForDate(dateStr);

    const cell = document.createElement('button');
    cell.className = `calendar-day ${level}`;
    cell.textContent = day;

    if (dateStr === todayStr) {
      cell.classList.add('today');
    }

    // Don't mark future dates
    const cellDate = new Date(currentYear, currentMonth, day);
    if (cellDate > today) {
      cell.className = 'calendar-day';
      cell.textContent = day;
    }

    cell.addEventListener('click', () => showDayDetail(dateStr, day));
    container.appendChild(cell);
  }
}

function showDayDetail(dateStr, day) {
  const detail = document.getElementById('dayDetail');
  const list = document.getElementById('dayDetailList');
  const title = document.getElementById('dayDetailTitle');

  const completed = getCompletedForDate(dateStr);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  title.textContent = `${monthNames[currentMonth]} ${day}, ${currentYear}`;
  list.innerHTML = '';

  if (completed.length === 0) {
    list.innerHTML = '<li style="color:var(--text-muted)">No habits completed</li>';
  } else {
    completed.forEach(h => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="detail-icon">${h.icon || '✅'}</span> ${escapeHtml(h.name)}`;
      list.appendChild(li);
    });
  }

  detail.classList.add('active');
}

function closeDayDetail() {
  document.getElementById('dayDetail').classList.remove('active');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
