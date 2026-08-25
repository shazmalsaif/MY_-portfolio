/**
 * AI Assistant Chat Interface & Introduction Popup Manager
 * Manages floating chat drawer, introduction popup, message thread, typing states, and API interaction.
 */
class ChatManager {
  constructor() {
    this.chatPanel = null;
    this.toggleBtn = null;
    this.closeBtn = null;
    this.inputField = null;
    this.sendBtn = null;
    this.messagesContainer = null;
    this.promptsContainer = null;
    this.introPopup = null;
    this.isOpen = false;
    this.isSubmitting = false;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.chatPanel = document.getElementById('ai-chat-panel');
      this.toggleBtn = document.getElementById('ai-assistant-toggle');
      this.closeBtn = document.getElementById('close-chat');
      this.inputField = document.getElementById('chat-input-field');
      this.sendBtn = document.getElementById('chat-send-btn');
      this.messagesContainer = document.getElementById('chat-messages-container');
      this.promptsContainer = document.getElementById('chat-prompts-container');
      this.introPopup = document.getElementById('ai-intro-popup');

      this.setupListeners();
      this.setupPromptButtons();
      this.setupIntroPopup();
    });
  }

  setupListeners() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        this.dismissIntroPopup(true);
        this.toggleChat();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeChat());
    }

    const tryAssistantBtn = document.getElementById('try-assistant-cta');
    if (tryAssistantBtn) {
      tryAssistantBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.dismissIntroPopup(true);
        this.openChat();
      });
    }

    if (this.inputField && this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());

      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    // Close on Escape if open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isOpen) {
          this.closeChat();
        } else if (this.introPopup && this.introPopup.classList.contains('visible')) {
          this.dismissIntroPopup(true);
        }
      }
    });
  }

  setupIntroPopup() {
    if (!this.introPopup) return;

    const closeIntroBtn = document.getElementById('close-ai-intro');
    const startChatBtn = document.getElementById('start-chat-intro');

    if (closeIntroBtn) {
      closeIntroBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dismissIntroPopup(true);
      });
    }

    if (startChatBtn) {
      startChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dismissIntroPopup(true);
        this.openChat();
      });
    }

    // Clicking anywhere inside the popup triggers opening the chat
    this.introPopup.addEventListener('click', (e) => {
      if (e.target.closest('#close-ai-intro')) return;
      this.dismissIntroPopup(true);
      this.openChat();
    });

    // First-visit check with 2.5 second delay
    const isDismissed = localStorage.getItem('ai_intro_dismissed') === 'true';
    if (!isDismissed) {
      setTimeout(() => {
        if (!this.isOpen && this.introPopup && localStorage.getItem('ai_intro_dismissed') !== 'true') {
          this.introPopup.classList.add('visible');
          this.introPopup.setAttribute('aria-hidden', 'false');
        }
      }, 2500);
    }
  }

  dismissIntroPopup(persist = true) {
    if (!this.introPopup) return;
    this.introPopup.classList.remove('visible');
    this.introPopup.setAttribute('aria-hidden', 'true');
    if (persist) {
      localStorage.setItem('ai_intro_dismissed', 'true');
    }
  }

  setupPromptButtons() {
    document.querySelectorAll('.chat-suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-prompt') || btn.textContent.trim();
        this.sendMessage(text);
      });
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    if (!this.chatPanel) return;
    this.dismissIntroPopup(true);
    this.isOpen = true;
    this.chatPanel.classList.add('active');
    this.chatPanel.setAttribute('aria-hidden', 'false');
    if (this.inputField) {
      setTimeout(() => this.inputField.focus(), 200);
    }
  }

  closeChat() {
    if (!this.chatPanel) return;
    this.isOpen = false;
    this.chatPanel.classList.remove('active');
    this.chatPanel.setAttribute('aria-hidden', 'true');
  }

  handleSendMessage() {
    if (!this.inputField) return;
    const message = this.inputField.value.trim();
    if (!message || this.isSubmitting) return;

    this.inputField.value = '';
    this.sendMessage(message);
  }

  async sendMessage(messageText) {
    if (!messageText || this.isSubmitting) return;

    // Ensure chat panel is open
    this.openChat();

    // Hide suggestion prompt buttons after first interaction to keep space clean
    if (this.promptsContainer) {
      this.promptsContainer.classList.add('hidden');
    }

    // Append User Message bubble
    this.appendUserMessage(messageText);

    // Append Typing Indicator
    const typingIndicator = this.appendTypingIndicator();
    this.isSubmitting = true;

    try {
      // Call backend API
      const result = await window.apiService.sendChatMessage(messageText);
      typingIndicator.remove();

      if (result && result.answer) {
        this.appendBotMessage(result.answer);
      } else {
        this.appendBotMessage('Received empty response from assistant backend.');
      }
    } catch (error) {
      typingIndicator.remove();
      const threadId = window.apiService.getThreadId();
      
      // Clear, honest, and helpful status when backend API is not yet running
      this.appendBotMessage(
        `Backend API endpoint (${CONFIG.ENDPOINTS.CHAT}) is configured and awaiting connection.\n\n` +
        `• Session Thread ID: \`${threadId}\`\n` +
        `• Request format ready: \`{ "message": "...", "thread_id": "${threadId}" }\`\n` +
        `• Base URL: \`${CONFIG.API_BASE_URL || 'Direct Origin / Serverless'}\``
      );
    } finally {
      this.isSubmitting = false;
      this.scrollToBottom();
    }
  }

  appendUserMessage(text) {
    if (!this.messagesContainer) return;
    const msgEl = document.createElement('div');
    msgEl.className = 'flex justify-end';
    msgEl.innerHTML = `
      <div class="bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed p-3.5 rounded-lg rounded-tr-none max-w-[85%] font-body-md text-sm leading-relaxed shadow-sm break-words">
        ${this.escapeHtml(text)}
      </div>
    `;
    this.messagesContainer.appendChild(msgEl);
    this.scrollToBottom();
  }

  appendBotMessage(markdownText) {
    if (!this.messagesContainer) return;
    const msgEl = document.createElement('div');
    msgEl.className = 'flex justify-start';
    
    // Format simple markdown into clean HTML
    const formattedHtml = this.formatMarkdown(markdownText);

    msgEl.innerHTML = `
      <div class="bg-surface-container-low dark:bg-neutral-800 text-on-surface dark:text-gray-100 border border-border-muted/50 dark:border-neutral-700 p-4 rounded-lg rounded-tl-none max-w-[90%] font-body-md text-sm leading-relaxed shadow-sm break-words">
        ${formattedHtml}
      </div>
    `;
    this.messagesContainer.appendChild(msgEl);
    this.scrollToBottom();
  }

  appendTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'flex justify-start items-center space-x-1 p-3 bg-surface-container-low dark:bg-neutral-800 border border-border-muted/30 dark:border-neutral-700 rounded-lg rounded-tl-none w-16';
    typingEl.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-on-surface-variant/60 dark:bg-gray-400 animate-bounce" style="animation-delay: 0ms"></span>
      <span class="w-2 h-2 rounded-full bg-on-surface-variant/60 dark:bg-gray-400 animate-bounce" style="animation-delay: 150ms"></span>
      <span class="w-2 h-2 rounded-full bg-on-surface-variant/60 dark:bg-gray-400 animate-bounce" style="animation-delay: 300ms"></span>
    `;
    this.messagesContainer.appendChild(typingEl);
    this.scrollToBottom();
    return typingEl;
  }

  formatMarkdown(text) {
    if (!text) return '';
    let escaped = this.escapeHtml(text);

    // Code blocks `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="bg-surface-container-high dark:bg-neutral-900 px-1.5 py-0.5 rounded font-label-sm text-xs text-primary dark:text-blue-400 font-mono">$1</code>');

    // Bold **bold**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-primary dark:text-white">$1</strong>');

    // Bullet points
    escaped = escaped.replace(/^• (.+)$/gm, '<li class="ml-4 list-disc text-on-surface dark:text-gray-200">$1</li>');

    // Newlines
    escaped = escaped.replace(/\n\n/g, '</p><p class="mt-2">');
    escaped = escaped.replace(/\n/g, '<br>');

    return `<p>${escaped}</p>`;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

window.chatManager = new ChatManager();
