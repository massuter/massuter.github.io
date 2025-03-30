// assets/js/theme-toggle.js

(function() {
  const themeToggleButton = document.getElementById('theme-toggle');
  const toggleIcon = themeToggleButton ? themeToggleButton.querySelector('.toggle-icon') : null;
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark'); // Apply to <html> for global scope
      if (toggleIcon) toggleIcon.textContent = '🌙'; // Moon icon for dark
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light'); // Apply to <html>
      if (toggleIcon) toggleIcon.textContent = '☀️'; // Sun icon for light
      localStorage.setItem('theme', 'light');
    }
    console.log(`Theme applied: ${theme}`);
  };

  // 1. Check localStorage first
  if (currentTheme) {
    applyTheme(currentTheme);
  } else {
    // 2. If no localStorage, check OS preference
    if (prefersDarkScheme.matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }

  // Add listener for the toggle button
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  } else {
    console.warn("Theme toggle button not found.");
  }

  // Add listener for changes in OS preference (optional, but good UX)
  prefersDarkScheme.addEventListener('change', (e) => {
    // Only change if the user hasn't manually set a theme via localStorage
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  console.log("Theme toggle script loaded.");

})(); // IIFE to avoid polluting global scope
