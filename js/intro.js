/**
 * AI Backend Engineer Intro Animation Controller
 * Manages intro lifecycle, sequential text reveals, status updates,
 * progress bar synchronization, theme detection, and keyboard/touch dismissal.
 */

(function () {
  'use strict';

  const INTRO_STATE = {
    PLAYING: 'PLAYING',
    COMPLETED: 'COMPLETED',
    EXITING: 'EXITING',
    DISMISSED: 'DISMISSED'
  };

  class IntroAnimationManager {
    constructor() {
      this.overlay = document.getElementById('intro-overlay');
      if (!this.overlay) return;

      this.statements = [
        document.getElementById('intro-line-1'),
        document.getElementById('intro-line-2'),
        document.getElementById('intro-line-3')
      ];

      this.statusRows = Array.from(document.querySelectorAll('.intro-system-status .status-row'));
      this.progressBar = document.getElementById('intro-progress-bar');
      this.progressNum = document.getElementById('intro-progress-num');
      this.skipBtn = document.getElementById('intro-skip-btn');
      this.enterPrompt = document.getElementById('intro-enter-prompt');
      this.enterText = document.getElementById('intro-enter-text');
      this.statusBadgeText = document.querySelector('.intro-status-badge .intro-status-text');
      this.footerStatusLabel = document.getElementById('intro-footer-status-label');

      this.state = INTRO_STATE.PLAYING;
      this.duration = 6500; // ~6.5 seconds target timeline
      this.startTime = null;
      this.animFrameId = null;
      this.timeouts = [];

      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

      this.init();
    }

    init() {
      // Prevent body scrolling while intro is active
      document.body.style.overflow = 'hidden';

      // Initialize theme detection and synchronization
      this.setupTheme();

      // Configure device-aware enter instruction text
      this.setupEnterLabel();

      // Bind interaction events (click, tap, keyboard)
      this.bindEvents();

      // If user prefers reduced motion, fast-track to completed state
      if (this.prefersReducedMotion) {
        this.handleReducedMotion();
        return;
      }

      // Schedule sequential text and status reveals
      this.scheduleSequence();

      // Start synchronized progress bar animation
      this.startProgressAnimation();
    }

    /**
     * Determine and apply theme based on:
     * 1. Explicit theme selected by visitor in portfolio (localStorage / html class)
     * 2. Browser/system preference: window.matchMedia('(prefers-color-scheme: dark)')
     */
    setupTheme() {
      const applyCurrentTheme = () => {
        const theme = this.getEffectiveTheme();
        this.applyTheme(theme);
      };

      applyCurrentTheme();

      // Listen for system preference changes if no manual override is active
      this.themeListener = (e) => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      };
      if (this.mediaQueryDark.addEventListener) {
        this.mediaQueryDark.addEventListener('change', this.themeListener);
      }

      // Observe <html> class changes in case user toggles theme
      this.themeObserver = new MutationObserver(() => {
        applyCurrentTheme();
      });
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    getEffectiveTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (document.documentElement.classList.contains('dark')) return 'dark';
      if (document.documentElement.classList.contains('light')) return 'light';
      return this.mediaQueryDark.matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
      if (!this.overlay) return;
      if (theme === 'dark') {
        this.overlay.classList.add('theme-dark');
        this.overlay.classList.remove('theme-light');
      } else {
        this.overlay.classList.add('theme-light');
        this.overlay.classList.remove('theme-dark');
      }
    }

    /**
     * Configure appropriate instruction wording based on device input capabilities
     */
    setupEnterLabel() {
      if (!this.enterText) return;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      if (isTouch) {
        this.enterText.textContent = 'Tap anywhere to enter';
      } else {
        this.enterText.textContent = 'Click anywhere to enter';
      }
    }

    bindEvents() {
      // Skip button handler during playback
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.state === INTRO_STATE.PLAYING) {
            this.exit(true);
          }
        });
      }

      // Overlay click/tap handler:
      // - During PLAYING: immediate skip directly to portfolio
      // - During COMPLETED: enter portfolio
      this.clickHandler = (e) => {
        if (this.state === INTRO_STATE.PLAYING) {
          this.exit(true);
        } else if (this.state === INTRO_STATE.COMPLETED) {
          this.exit(false);
        }
      };
      this.overlay.addEventListener('click', this.clickHandler);

      // Keyboard navigation (Escape, Enter, Space)
      this.keyHandler = (e) => {
        if (this.state !== INTRO_STATE.PLAYING && this.state !== INTRO_STATE.COMPLETED) return;
        if (e.key === 'Escape' || e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          this.exit(this.state === INTRO_STATE.PLAYING);
        }
      };
      window.addEventListener('keydown', this.keyHandler, { passive: false });
    }

    /**
     * Coordinated 6.5s timeline:
     * 0.0–1.0s: Background, header appear, network and progress begin.
     * 1.0–2.0s: "Engineering intelligence." appears.
     * 2.0–3.0s: "Building reliability." appears (1st line remains visible).
     * 3.0–4.0s: "Designed to scale." appears (1st & 2nd lines remain visible).
     * 2.0–5.5s: System-status indicators activate sequentially.
     * 5.5–6.5s: Progress completes (100%), transition to COMPLETED, reveal enter instruction.
     */
    scheduleSequence() {
      // 1.0s: Line 1 appears (Engineering intelligence.)
      this.timeouts.push(
        setTimeout(() => {
          if (this.statements[0]) this.statements[0].classList.add('is-visible');
        }, 1000)
      );

      // 2.2s: Line 2 appears (Building reliability.)
      this.timeouts.push(
        setTimeout(() => {
          if (this.statements[1]) this.statements[1].classList.add('is-visible');
        }, 2200)
      );

      // 2.4s: Status row 0 activates (AI SYSTEMS)
      this.timeouts.push(
        setTimeout(() => {
          if (this.statusRows[0]) this.statusRows[0].classList.add('is-active');
        }, 2400)
      );

      // 3.4s: Line 3 appears (Designed to scale.) - lines 1 & 2 remain visible
      this.timeouts.push(
        setTimeout(() => {
          if (this.statements[2]) this.statements[2].classList.add('is-visible');
        }, 3400)
      );

      // 3.5s: Status row 1 activates (RETRIEVAL PIPELINES)
      this.timeouts.push(
        setTimeout(() => {
          if (this.statusRows[1]) this.statusRows[1].classList.add('is-active');
        }, 3500)
      );

      // 4.4s: Status row 2 activates (BACKEND SERVICES)
      this.timeouts.push(
        setTimeout(() => {
          if (this.statusRows[2]) this.statusRows[2].classList.add('is-active');
        }, 4400)
      );

      // 5.3s: Status row 3 activates (DEPLOYMENT ENVIRONMENT)
      this.timeouts.push(
        setTimeout(() => {
          if (this.statusRows[3]) this.statusRows[3].classList.add('is-active');
        }, 5300)
      );

      // 6.5s: Progress finishes, transition to COMPLETED state (DO NOT auto-dismiss)
      this.timeouts.push(
        setTimeout(() => {
          this.onAnimationComplete();
        }, this.duration)
      );
    }

    startProgressAnimation() {
      const step = (timestamp) => {
        if (this.state !== INTRO_STATE.PLAYING) return;
        if (!this.startTime) this.startTime = timestamp;

        const elapsed = timestamp - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1.0);
        const percent = Math.floor(progress * 100);

        if (this.progressBar) {
          this.progressBar.style.width = `${progress * 100}%`;
        }

        if (this.progressNum) {
          this.progressNum.textContent = `${percent}%`;
        }

        if (progress < 1.0) {
          this.animFrameId = requestAnimationFrame(step);
        } else {
          this.onAnimationComplete();
        }
      };

      this.animFrameId = requestAnimationFrame(step);
    }

    /**
     * Phase B: Intro Completed
     * Reaching 100% means the animation is complete, not that the visitor has entered.
     * Keep overlay visible and waiting for user click/tap/keypress.
     */
    onAnimationComplete() {
      if (this.state !== INTRO_STATE.PLAYING) return;
      this.state = INTRO_STATE.COMPLETED;

      // Cancel animation frame and timers
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.timeouts.forEach((t) => clearTimeout(t));
      this.timeouts = [];

      // Ensure progress bar stays pinned at 100%
      if (this.progressBar) this.progressBar.style.width = '100%';
      if (this.progressNum) this.progressNum.textContent = '100%';

      // Ensure all headline statements and status rows are fully visible
      this.statements.forEach((el) => el && el.classList.add('is-visible'));
      this.statusRows.forEach((el) => el && el.classList.add('is-active'));

      // Update header & footer status labels
      if (this.statusBadgeText) {
        this.statusBadgeText.textContent = '> system ready';
      }
      if (this.footerStatusLabel) {
        this.footerStatusLabel.textContent = 'PORTFOLIO READY [100%]';
      }

      // Add completed class to overlay to show enter prompt and enable pointer cursor
      if (this.overlay) {
        this.overlay.classList.add('intro-completed');
      }
    }

    handleReducedMotion() {
      // Immediately reveal all text, rows, and set 100%
      this.onAnimationComplete();
    }

    /**
     * Phase C: Visitor Enters Portfolio
     * Smooth exit transition without retriggering or race conditions.
     */
    exit(isSkip = false) {
      if (this.state === INTRO_STATE.EXITING || this.state === INTRO_STATE.DISMISSED) return;
      this.state = INTRO_STATE.EXITING;

      // Cancel active frames and timers
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.timeouts.forEach((tid) => clearTimeout(tid));
      this.timeouts = [];

      // Clean up event listeners
      if (this.keyHandler) {
        window.removeEventListener('keydown', this.keyHandler);
      }
      if (this.clickHandler && this.overlay) {
        this.overlay.removeEventListener('click', this.clickHandler);
      }
      if (this.mediaQueryDark && this.themeListener) {
        if (this.mediaQueryDark.removeEventListener) {
          this.mediaQueryDark.removeEventListener('change', this.themeListener);
        }
      }
      if (this.themeObserver) {
        this.themeObserver.disconnect();
      }

      // Restore normal page scrolling
      document.body.style.overflow = '';

      // Ensure progress is displayed at 100%
      if (this.progressBar) this.progressBar.style.width = '100%';
      if (this.progressNum) this.progressNum.textContent = '100%';

      // Smooth fade-out of overlay (350ms)
      if (this.overlay) {
        this.overlay.classList.add('intro-fade-out');
        this.overlay.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
          this.overlay.classList.add('intro-hidden');
          this.state = INTRO_STATE.DISMISSED;
          // Dispatch custom event for portfolio lifecycle awareness
          window.dispatchEvent(new CustomEvent('introCompleted'));
        }, 400);
      }
    }
  }

  // Initialize as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new IntroAnimationManager();
    });
  } else {
    new IntroAnimationManager();
  }
})();
