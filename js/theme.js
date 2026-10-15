/**
 * Theme Management Module
 * Controls light/dark mode, persists preferences, and coordinates audio triggers.
 */
class ThemeManager {
  constructor() {
    this.htmlElement = document.documentElement;
    this.toggleButtons = [];
    this.theme = 'dark';
    this.init();
  }

  init() {
    // Determine initial theme
    // Priority:
    // 1. Explicitly selected theme in portfolio (if one is set)
    // 2. Browser/system preference: window.matchMedia('(prefers-color-scheme: dark)')
    const isExplicit = localStorage.getItem('theme_user_set') === 'true';
    const savedTheme = isExplicit ? localStorage.getItem('theme') : null;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.theme = 'light';
    } else {
      // Do not default to light mode when theme detection is unavailable
      this.theme = 'dark';
    }

    // Apply theme without sound, and DO NOT persist system preference to localStorage
    this.applyTheme(this.theme, false, isExplicit);

    // Watch for system theme changes if user hasn't explicitly set one
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemListener = (e) => {
        const userExplicit = localStorage.getItem('theme_user_set') === 'true';
        if (!userExplicit) {
          this.applyTheme(e.matches ? 'dark' : 'light', false, false);
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', systemListener);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(systemListener);
      }
    }

    // Attach listeners once DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupListeners();
      });
    } else {
      this.setupListeners();
    }
  }

  setupListeners() {
    const mainToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-theme-toggle');
    
    if (mainToggle && !this.toggleButtons.includes(mainToggle)) {
      this.toggleButtons.push(mainToggle);
      mainToggle.addEventListener('click', () => this.toggleTheme());
    }
    if (mobileToggle && !this.toggleButtons.includes(mobileToggle)) {
      this.toggleButtons.push(mobileToggle);
      mobileToggle.addEventListener('click', () => this.toggleTheme());
    }

    this.updateIcons();
  }

  applyTheme(newTheme, playSound = false, persist = true) {
    this.theme = newTheme;
    if (newTheme === 'dark') {
      this.htmlElement.classList.add('dark');
      this.htmlElement.classList.remove('light');
    } else {
      this.htmlElement.classList.remove('dark');
      this.htmlElement.classList.add('light');
    }

    if (persist) {
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('theme_user_set', 'true');
    }
    this.updateIcons();

    if (playSound && window.soundEngine) {
      if (newTheme === 'light') {
        window.soundEngine.playThemeLight();
      } else {
        window.soundEngine.playThemeDark();
      }
    }
  }

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme, true, true);
  }

  updateIcons() {
    const iconName = this.theme === 'dark' ? 'light_mode' : 'dark_mode';
    const ariaLabel = this.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    
    this.toggleButtons.forEach(btn => {
      const iconSpan = btn.querySelector('.material-symbols-outlined') || btn.querySelector('[data-icon]');
      if (iconSpan) {
        iconSpan.textContent = iconName;
        iconSpan.setAttribute('data-icon', iconName);
      }
      btn.setAttribute('aria-label', ariaLabel);
      btn.setAttribute('title', ariaLabel);
    });
  }
}

window.themeManager = new ThemeManager();
