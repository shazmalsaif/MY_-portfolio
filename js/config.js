/**
 * Application Configuration
 * Environment-variable ready for Vercel / backend deployment
 */
const CONFIG = {
  // Base URL for backend API (can be configured via window.APP_CONFIG, window.__ENV__, or left blank for same-origin proxy)
  API_BASE_URL: (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) ||
                (window.__ENV__ && window.__ENV__.VITE_API_URL) ||
                (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) ||
                'https://shazamal-saif-portfolio-backend.vercel.app',

  // API Endpoints
  ENDPOINTS: {
    CHAT: '/api/chat',
    CONTACT: '/api/contact',
    HEALTH: '/api/health',
  },

  // Author Information
  AUTHOR: {
    name: 'Shazamal Saif',
    role: 'AI Backend Engineer',
    location: 'Dhaka, Bangladesh',
    email: 'shazamalsaif82@gmail.com',
    github: 'https://github.com/shazmalsaif',
    linkedin: 'https://www.linkedin.com/in/shazamal-saif-3b8a38308/',
    facebook: 'https://www.facebook.com/shazamal.saif',
  },

  // Audio settings
  AUDIO: {
    enabled: true,
    lightSoundPath: 'assets/sounds/theme-light.mp3',
    darkSoundPath: 'assets/sounds/theme-dark.mp3',
    volume: 0.15,
  }
};

window.CONFIG = CONFIG;
