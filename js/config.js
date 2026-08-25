/**
 * Application Configuration
 * Environment-variable ready for Vercel / backend deployment
 */
const CONFIG = {
  // Base URL for backend API (can be overridden by window.__ENV__ or left relative for Vercel serverless / proxy)
  API_BASE_URL: window.APP_CONFIG?.API_BASE_URL || '',
  
  // API Endpoints
  ENDPOINTS: {
    CHAT: '/api/chat',
    CONTACT: '/api/contact',
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
