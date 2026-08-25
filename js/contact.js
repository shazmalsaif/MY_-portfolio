/**
 * Contact Form Validation & Submission Handling
 */
class ContactManager {
  constructor() {
    this.form = null;
    this.nameInput = null;
    this.emailInput = null;
    this.messageInput = null;
    this.statusAlert = null;
    this.submitBtn = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.form = document.getElementById('contact-form');
      if (!this.form) return;

      this.nameInput = document.getElementById('contact-name');
      this.emailInput = document.getElementById('contact-email');
      this.messageInput = document.getElementById('contact-message');
      this.statusAlert = document.getElementById('contact-status-alert');
      this.submitBtn = document.getElementById('contact-submit-btn');

      this.setupForm();
    });
  }

  setupForm() {
    // Real-time input clear errors
    [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      }
    });

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  clearFieldError(input) {
    input.classList.remove('border-error', 'dark:border-error');
    const errEl = document.getElementById(`${input.id}-error`);
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.add('hidden');
    }
  }

  showFieldError(input, message) {
    input.classList.add('border-error', 'dark:border-error');
    const errEl = document.getElementById(`${input.id}-error`);
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.remove('hidden');
    }
  }

  validateForm() {
    let isValid = true;

    const nameVal = this.nameInput ? this.nameInput.value.trim() : '';
    const emailVal = this.emailInput ? this.emailInput.value.trim() : '';
    const messageVal = this.messageInput ? this.messageInput.value.trim() : '';

    if (!nameVal || nameVal.length < 2) {
      this.showFieldError(this.nameInput, 'Please enter your name (at least 2 characters).');
      isValid = false;
    } else {
      this.clearFieldError(this.nameInput);
    }

    if (!emailVal || !this.validateEmail(emailVal)) {
      this.showFieldError(this.emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      this.clearFieldError(this.emailInput);
    }

    if (!messageVal || messageVal.length < 10) {
      this.showFieldError(this.messageInput, 'Please enter a message (at least 10 characters).');
      isValid = false;
    } else {
      this.clearFieldError(this.messageInput);
    }

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.validateForm()) return;

    const payload = {
      name: this.nameInput.value.trim(),
      email: this.emailInput.value.trim(),
      message: this.messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    this.setSubmitting(true);
    this.setStatus('Sending inquiry...', 'info');

    try {
      await window.apiService.submitContact(payload);
      this.setStatus('Thank you! Your message has been sent successfully.', 'success');
      this.form.reset();
    } catch (error) {
      // Backend not yet connected - honest, transparent notification with mailto fallback
      this.setStatus(
        `Contact API endpoint (${CONFIG.ENDPOINTS.CONTACT}) is ready for connection. ` +
        `In the meantime, you can reach Saif directly at <a href="mailto:${CONFIG.AUTHOR.email}" class="underline font-bold">${CONFIG.AUTHOR.email}</a>.`,
        'notice'
      );
    } finally {
      this.setSubmitting(false);
    }
  }

  setSubmitting(isSubmitting) {
    if (this.submitBtn) {
      this.submitBtn.disabled = isSubmitting;
      if (isSubmitting) {
        this.submitBtn.innerHTML = `
          <span class="inline-block animate-spin mr-2">⟳</span> Sending...
        `;
      } else {
        this.submitBtn.innerHTML = `
          Send Message <span class="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
        `;
      }
    }
  }

  setStatus(message, type = 'info') {
    if (!this.statusAlert) return;
    this.statusAlert.innerHTML = message;
    this.statusAlert.classList.remove('hidden', 'bg-green-500/10', 'text-green-700', 'dark:text-green-300', 'bg-error/10', 'text-error', 'bg-surface-container-high', 'text-on-surface');

    if (type === 'success') {
      this.statusAlert.classList.add('bg-green-500/10', 'text-green-700', 'dark:text-green-300', 'border', 'border-green-500/30');
    } else if (type === 'error') {
      this.statusAlert.classList.add('bg-error/10', 'text-error', 'border', 'border-error/30');
    } else {
      this.statusAlert.classList.add('bg-surface-container-high', 'text-on-surface', 'border', 'border-border-muted', 'dark:border-outline-variant');
    }
  }
}

window.contactManager = new ContactManager();
