/**
 * Navigation Module
 * Smooth scrolling, active section scroll-spy, and mobile drawer management.
 */
class NavigationManager {
  constructor() {
    this.navLinks = [];
    this.sections = [];
    this.mobileMenuOpen = false;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupSmoothScroll();
      this.setupMobileMenu();
      this.setupScrollSpy();
    });
  }

  setupSmoothScroll() {
    // Intercept all hash links for smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#placeholder') {
          e.preventDefault();
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (this.mobileMenuOpen) {
            this.closeMobileMenu();
          }

          // Update URL hash without jumping
          history.pushState(null, '', href);
        }
      });
    });
  }

  setupMobileMenu() {
    const hamburgerBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('close-mobile-menu');
    const backdrop = document.getElementById('mobile-nav-backdrop');

    if (hamburgerBtn && mobileMenu) {
      hamburgerBtn.addEventListener('click', () => {
        this.openMobileMenu();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      }

      if (backdrop) {
        backdrop.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    }
  }

  openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const hamburgerBtn = document.getElementById('mobile-menu-toggle');

    if (mobileMenu && backdrop) {
      this.mobileMenuOpen = true;
      backdrop.classList.remove('hidden');
      setTimeout(() => backdrop.classList.add('opacity-100'), 10);
      mobileMenu.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
      if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const hamburgerBtn = document.getElementById('mobile-menu-toggle');

    if (mobileMenu && backdrop) {
      this.mobileMenuOpen = false;
      mobileMenu.classList.add('translate-x-full');
      backdrop.classList.remove('opacity-100');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
      document.body.classList.remove('overflow-hidden');
      if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  setupScrollSpy() {
    const sectionIds = ['hero', 'about', 'links', 'stack', 'work', 'contact'];
    const navItems = document.querySelectorAll('.desktop-nav-link');

    const updateActiveNav = () => {
      const scrollPos = window.scrollY + 120;

      let currentSectionId = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentSectionId = id;
          }
        }
      }

      navItems.forEach(link => {
        const href = link.getAttribute('href');
        const matches = (href === `#${currentSectionId}`) || 
                        (currentSectionId === 'stack' && href === '#skills') ||
                        (currentSectionId === 'skills' && href === '#stack');

        if (matches) {
          link.classList.add('text-primary', 'dark:text-primary-fixed', 'border-b', 'border-primary', 'dark:border-primary-fixed', 'pb-1');
          link.classList.remove('text-on-surface-variant', 'dark:text-on-primary-container');
        } else {
          link.classList.remove('text-primary', 'dark:text-primary-fixed', 'border-b', 'border-primary', 'dark:border-primary-fixed', 'pb-1');
          link.classList.add('text-on-surface-variant', 'dark:text-on-primary-container');
        }
      });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }
}

window.navigationManager = new NavigationManager();
