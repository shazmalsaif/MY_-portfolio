/**
 * Theme Management Module
 * Controls light/dark mode, persists preferences, and coordinates audio triggers.
 */
class ThemeManager {
  constructor() {
    this.htmlElement = document.documentElement;
    this.toggleButtons = [];
    this.theme = 'light';
    this.init();
  }

  init() {
    // Determine initial theme without sound
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }

    this.applyTheme(this.theme, false);

    // Watch for system theme changes if user hasn't explicitly set one
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });

    // Attach listeners once DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.setupListeners();
    });
  }

  setupListeners() {
    const mainToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-theme-toggle');
    
    if (mainToggle) {
      this.toggleButtons.push(mainToggle);
      mainToggle.addEventListener('click', () => this.toggleTheme());
    }
    if (mobileToggle) {
      this.toggleButtons.push(mobileToggle);
      mobileToggle.addEventListener('click', () => this.toggleTheme());
    }

    this.updateIcons();
  }

  applyTheme(newTheme, playSound = false) {
    this.theme = newTheme;
    if (newTheme === 'dark') {
      this.htmlElement.classList.add('dark');
      this.htmlElement.classList.remove('light');
    } else {
      this.htmlElement.classList.remove('dark');
      this.htmlElement.classList.add('light');
    }

    localStorage.setItem('theme', newTheme);
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
    this.applyTheme(nextTheme, true);
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
