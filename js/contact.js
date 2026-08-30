/**
 * Contact Form Validation & Submission Handling
 * Integrates client-side validation with FastAPI Backend endpoint (/api/contact)
 */
class ContactManager {
  constructor() {
    this.form = null;
    this.nameInput = null;
    this.emailInput = null;
    this.subjectInput = null;
    this.messageInput = null;
    this.honeypotInput = null;
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
      this.subjectInput = document.getElementById('contact-subject');
      this.messageInput = document.getElementById('contact-message');
      this.honeypotInput = document.getElementById('contact-hp');
      this.statusAlert = document.getElementById('contact-status-alert');
      this.submitBtn = document.getElementById('contact-submit-btn');

      this.setupForm();
    });
  }

  setupForm() {
    // Real-time error clearing on input
    [this.nameInput, this.emailInput, this.subjectInput, this.messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      }
    });

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateEmail(email) {
    // Standard RFC-compliant email regex
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(String(email).trim());
  }

  clearFieldError(input) {
    if (!input) return;
    input.classList.remove('border-error', 'dark:border-error');
    const errEl = document.getElementById(`${input.id}-error`);
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.add('hidden');
    }
  }

  showFieldError(input, message) {
    if (!input) return;
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
    const subjectVal = this.subjectInput ? this.subjectInput.value.trim() : '';
    const messageVal = this.messageInput ? this.messageInput.value.trim() : '';

    // 1. Name Validation (Required, 1-100 characters)
    if (!nameVal) {
      this.showFieldError(this.nameInput, 'Please enter your name.');
      isValid = false;
    } else if (nameVal.length > 100) {
      this.showFieldError(this.nameInput, 'Name must not exceed 100 characters.');
      isValid = false;
    } else {
      this.clearFieldError(this.nameInput);
    }

    // 2. Email Validation (Required, valid format, max 254 characters)
    if (!emailVal) {
      this.showFieldError(this.emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (emailVal.length > 254) {
      this.showFieldError(this.emailInput, 'Email must not exceed 254 characters.');
      isValid = false;
    } else if (!this.validateEmail(emailVal)) {
      this.showFieldError(this.emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      this.clearFieldError(this.emailInput);
    }

    // 3. Subject Validation (Required, 1-200 characters)
    if (!subjectVal) {
      this.showFieldError(this.subjectInput, 'Please enter the subject.');
      isValid = false;
    } else if (subjectVal.length > 200) {
      this.showFieldError(this.subjectInput, 'Subject must not exceed 200 characters.');
      isValid = false;
    } else {
      this.clearFieldError(this.subjectInput);
    }

    // 4. Message Validation (Required, 10-5000 characters)
    if (!messageVal) {
      this.showFieldError(this.messageInput, 'Please enter your message.');
      isValid = false;
    } else if (messageVal.length < 10) {
      this.showFieldError(this.messageInput, 'Message must be at least 10 characters long.');
      isValid = false;
    } else if (messageVal.length > 5000) {
      this.showFieldError(this.messageInput, 'Message must not exceed 5000 characters.');
      isValid = false;
    } else {
      this.clearFieldError(this.messageInput);
    }

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // 1. Client-side Validation
    if (!this.validateForm()) {
      return;
    }

    const payload = {
      name: this.nameInput ? this.nameInput.value.trim() : '',
      email: this.emailInput ? this.emailInput.value.trim() : '',
      subject: this.subjectInput ? this.subjectInput.value.trim() : '',
      message: this.messageInput ? this.messageInput.value.trim() : '',
      _hp: this.honeypotInput ? this.honeypotInput.value.trim() : ''
    };

    // 2. Disable submit button & show "Sending..."
    this.setSubmitting(true);
    this.hideStatus();

    try {
      // 3. Send request to FastAPI backend
      const result = await window.apiService.submitContact(payload);

      // 4. If successful: Clear form & show success notification
      if (result && result.success !== false) {
        this.form.reset();
        this.setStatus("Thanks! Your message has been sent successfully. I'll get back to you soon.", 'success');
      } else {
        throw new Error((result && result.message) || 'Unable to send message.');
      }
    } catch (error) {
      // 5. If unsuccessful: Do NOT clear form & show error notification
      const directEmail = (window.CONFIG && window.CONFIG.AUTHOR && window.CONFIG.AUTHOR.email) || 'shazamalsaif82@gmail.com';
      this.setStatus(
        `Something went wrong. Please try again or email me directly at <a href="mailto:${directEmail}" class="underline font-bold">${directEmail}</a>.`,
        'error'
      );
    } finally {
      // 6. Re-enable submit button
      this.setSubmitting(false);
    }
  }

  setSubmitting(isSubmitting) {
    if (this.submitBtn) {
      this.submitBtn.disabled = isSubmitting;
      if (isSubmitting) {
        this.submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-current inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Sending...
        `;
      } else {
        this.submitBtn.innerHTML = `
          Send Message <span class="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
        `;
      }
    }
  }

  hideStatus() {
    if (this.statusAlert) {
      this.statusAlert.classList.add('hidden');
    }
  }

  setStatus(message, type = 'info') {
    if (!this.statusAlert) return;
    this.statusAlert.innerHTML = message;
    this.statusAlert.classList.remove('hidden', 'bg-green-500/10', 'text-green-700', 'dark:text-green-300', 'bg-error/10', 'text-error', 'bg-surface-container-high', 'text-on-surface', 'border-green-500/30', 'border-error/30', 'border-border-muted');

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
