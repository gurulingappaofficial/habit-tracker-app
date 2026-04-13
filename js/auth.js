// ============================================
// auth.js — Session Management
// ============================================

/**
 * Checks if the user is authenticated. 
 * If not, redirects to login.html.
 * Should be called at the very top of each page script.
 */
function checkAuth() {
  const user = getUser();
  if (!user && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
  }
}

/**
 * Handles the login process.
 * Saves user data and redirects to home.
 */
function handleLogin(name, phone) {
  if (!name || !phone) return false;
  
  const user = {
    name,
    phone,
    loginDate: new Date().toISOString()
  };
  
  saveUser(user);
  window.location.href = 'index.html';
  return true;
}

/**
 * Clears user data and redirects to login.
 */
function logout() {
  localStorage.removeItem('ht_user');
  window.location.href = 'login.html';
}

// Auto-run checkAuth when script is loaded
checkAuth();
