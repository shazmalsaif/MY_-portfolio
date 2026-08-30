/**
 * API Service Abstraction
 * Handles communication with the FastAPI Backend & AI Endpoints
 */
class ApiService {
  constructor() {
    this.getBaseUrl = () => {
      return (window.CONFIG && window.CONFIG.API_BASE_URL) ? window.CONFIG.API_BASE_URL.replace(/\/+$/, '') : '';
    };
  }

  /**
   * Get or generate a persistent unique session/thread ID for this visitor
   */
  getThreadId() {
    let threadId = localStorage.getItem('ai_thread_id');
    if (!threadId) {
      threadId = 'session_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('ai_thread_id', threadId);
    }
    return threadId;
  }

  /**
   * Send a chat query to the backend AI endpoint
   * @param {string} message - Visitor question
   * @returns {Promise<{answer: string}>}
   */
  async sendChatMessage(message) {
    const threadId = this.getThreadId();
    const endpoint = (window.CONFIG && window.CONFIG.ENDPOINTS && window.CONFIG.ENDPOINTS.CHAT) || '/api/chat';
    const url = `${this.getBaseUrl()}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          thread_id: threadId
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Chat API error:', error.message);
      throw error;
    }
  }

  /**
   * Submit contact inquiry to the FastAPI backend endpoint
   * @param {{name: string, email: string, subject: string, message: string, _hp?: string}} payload
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async submitContact(payload) {
    const endpoint = (window.CONFIG && window.CONFIG.ENDPOINTS && window.CONFIG.ENDPOINTS.CONTACT) || '/api/contact';
    const url = `${this.getBaseUrl()}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = null;
      }

      if (!response.ok) {
        const errorMsg = (data && data.message) || (data && data.detail) || `Request failed with status ${response.status}`;
        const error = new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data || { success: true, message: 'Message sent successfully.' };
    } catch (error) {
      console.error('Contact submission error:', error);
      throw error;
    }
  }
}

window.apiService = new ApiService();
