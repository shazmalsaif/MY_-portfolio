/**
 * API Service Abstraction
 * Handles communication with the AI Backend & Form Endpoints
 */
class ApiService {
  constructor() {
    this.baseUrl = (window.CONFIG && window.CONFIG.API_BASE_URL) || '';
  }

  /**
   * Get or generate a persistent unique session/thread ID for this visitor
   */
  getThreadId() {
    let threadId = localStorage.getItem('ai_thread_id');
    if (!threadId) {
      // Generate standard RFC4122 v4 UUID or timestamp random hash
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
    const endpoint = (CONFIG.ENDPOINTS && CONFIG.ENDPOINTS.CHAT) || '/api/chat';
    const url = `${this.baseUrl}${endpoint}`;

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
      console.warn('API Service communication note:', error.message);
      // Return structured response indicating API connectivity state
      throw error;
    }
  }

  /**
   * Submit contact inquiry to the backend endpoint
   * @param {{name: string, email: string, message: string}} payload
   */
  async submitContact(payload) {
    const endpoint = (CONFIG.ENDPOINTS && CONFIG.ENDPOINTS.CONTACT) || '/api/contact';
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

window.apiService = new ApiService();
