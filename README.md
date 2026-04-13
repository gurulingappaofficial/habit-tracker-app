# Habit Tracker — Modern Web App 🚀

A sleek, mobile-first, and privacy-focused habit tracking application. Build better routines, track your streaks, and visualize your progress with a premium dark-themed UI.

![Habit Tracker Preview](https://raw.githubusercontent.com/placeholder-path/to/preview.png)

## ✨ Features

- **Personalized Dashboard**: Real-time progress tracking with a dynamic greeting based on the time of day.
- **Smart Habit Management**:
    - Select from categorized chips.
    - Beautiful inline emoji grid for icons.
    - Customizable target days (Daily, or specific week days).
- **Interactive Analytics**: Visualize your consistency with Chart.js-powered weekly completion bars and 30-day history lines.
- **Visual Calendar**: Monthly view with color-coded completion levels (None, Partial, Full).
- **Secure Selection**: Native client-side login with Name & Phone Number (data stays on your device!).
- **Rich UI/UX**:
    - Premium Dark Mode.
    - Confetti celebrations on task completion.
    - Smooth slide-up modals and glassmorphism design.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables), JavaScript (ES6+).
- **Charts**: [Chart.js](https://www.chartjs.org/) via CDN.
- **Storage**: `localStorage` (No database required, high speed).
- **Design**: Poppins Typography, Gradient Aesthetics, Font Awesome-free (Emoji-based).

## 🚀 Getting Started

No installation required! Just clone and open in your browser.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/habit-tracker.git
   ```
2. **Open the project**:
   Open `index.html` in any modern web browser.
3. **Login**:
   Enter your name and phone number to start your journey!

## 📂 File Structure

```text
Habit Tracker/
├── index.html           # Main Dashboard
├── login.html           # User Authentication
├── analytics.html       # Progress Charts
├── calendar.html        # History View
├── settings.html        # App Preferences
├── css/
│   └── styles.css       # Core Design System
└── js/
    ├── app.js           # Dashboard Logic
    ├── auth.js          # Session Management
    ├── analytics.js     # Data Visualization
    ├── calendar.js      # Monthly Grid Logic
    └── storage.js       # Data Persistence Layer
```

## 🔒 Privacy

All your data is stored locally in your browser's `localStorage`. No data is sent to any external server. 

---
*Built with ❤️ for a better you.*
