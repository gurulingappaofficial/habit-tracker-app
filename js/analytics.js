// ============================================
// analytics.js — Analytics Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  populateStats();
  renderWeeklyChart();
  renderMonthlyChart();
});

// ---------- Stats ----------
function populateStats() {
  const habits = getHabits();
  document.getElementById('statTotal').textContent = habits.length;
  document.getElementById('statDone').textContent = getTodayCompletedCount();
  document.getElementById('statRate').textContent = getSuccessRate() + '%';
  document.getElementById('statStreak').textContent = getBestStreak();
}

// ---------- Weekly Bar Chart ----------
function renderWeeklyChart() {
  const { labels, data } = getWeeklyData();
  const ctx = document.getElementById('weeklyChart').getContext('2d');

  const isDark = getDarkMode();
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? '#94A3B8' : '#64748B';

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Completed',
        data,
        backgroundColor: createGradient(ctx, '#6366F1', '#A78BFA'),
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1E293B' : '#fff',
          titleColor: isDark ? '#F1F5F9' : '#1E293B',
          bodyColor: isDark ? '#94A3B8' : '#64748B',
          borderColor: isDark ? '#334155' : '#E2E8F0',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: tickColor, font: { family: 'Poppins' } },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: tickColor, font: { family: 'Poppins', weight: 500 } },
          grid: { display: false }
        }
      }
    }
  });
}

// ---------- 30-Day Line Chart ----------
function renderMonthlyChart() {
  const { labels, data } = getLast30DaysData();
  const ctx = document.getElementById('monthlyChart').getContext('2d');

  const isDark = getDarkMode();
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? '#94A3B8' : '#64748B';

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Completed',
        data,
        borderColor: '#6366F1',
        backgroundColor: createAreaGradient(ctx, '#6366F1'),
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1E293B' : '#fff',
          titleColor: isDark ? '#F1F5F9' : '#1E293B',
          bodyColor: isDark ? '#94A3B8' : '#64748B',
          borderColor: isDark ? '#334155' : '#E2E8F0',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: tickColor, font: { family: 'Poppins' } },
          grid: { color: gridColor }
        },
        x: {
          ticks: {
            color: tickColor,
            font: { family: 'Poppins', size: 10 },
            maxTicksLimit: 10
          },
          grid: { display: false }
        }
      }
    }
  });
}

// ---------- Gradient Helpers ----------
function createGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

function createAreaGradient(ctx, color) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, color + '40');
  gradient.addColorStop(1, color + '05');
  return gradient;
}
