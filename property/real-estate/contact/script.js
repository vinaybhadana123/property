// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const consentInput = document.querySelector('input[name="consent"]');
  
  // Error message elements
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');
  const consentError = document.getElementById('consentError');

  // Validation functions
  function validateName() {
    const value = nameInput.value.trim();
    if (value.length < 2) {
      showError(nameError, 'Name must be at least 2 characters long');
      return false;
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      showError(nameError, 'Name can only contain letters and spaces');
      return false;
    } else {
      hideError(nameError);
      return true;
    }
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(emailError, 'Please enter a valid email address');
      return false;
    } else {
      hideError(emailError);
      return true;
    }
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      showError(phoneError, 'Please enter a valid 10-digit Indian phone number');
      return false;
    } else {
      hideError(phoneError);
      return true;
    }
  }

  function validateSubject() {
    const value = subjectInput.value;
    if (value === '') {
      showError(subjectError, 'Please select a subject');
      return false;
    } else {
      hideError(subjectError);
      return true;
    }
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (value.length < 10) {
      showError(messageError, 'Message must be at least 10 characters long');
      return false;
    } else {
      hideError(messageError);
      return true;
    }
  }

  function validateConsent() {
    if (!consentInput.checked) {
      showError(consentError, 'You must agree to receive communications');
      return false;
    } else {
      hideError(consentError);
      return true;
    }
  }

  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.parentElement.classList.add('error');
  }

  function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
    element.parentElement.classList.remove('error');
  }

  // Real-time validation
  nameInput.addEventListener('blur', validateName);
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length > 0) {
      validateName();
    }
  });

  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', () => {
    if (emailInput.value.trim().length > 0) {
      validateEmail();
    }
  });

  phoneInput.addEventListener('blur', validatePhone);
  phoneInput.addEventListener('input', () => {
    if (phoneInput.value.trim().length > 0) {
      validatePhone();
    }
  });

  subjectInput.addEventListener('change', validateSubject);

  messageInput.addEventListener('blur', validateMessage);
  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length > 0) {
      validateMessage();
    }
  });

  consentInput.addEventListener('change', validateConsent);

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();
    const isConsentValid = validateConsent();

    // If all validations pass, submit the form
    if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid && isConsentValid) {
      submitForm();
    }
  });

  function submitForm() {
    // Create form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate API call
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="material-symbols-rounded">hourglass_empty</span>
      <span class="btn-text">Sending...</span>
    `;

    // Simulate network delay
    setTimeout(() => {
      // Success state
      submitBtn.innerHTML = `
        <span class="material-symbols-rounded">check_circle</span>
        <span class="btn-text">Sent Successfully!</span>
      `;
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      submitBtn.style.borderColor = 'rgba(16, 185, 129, 0.5)';
      
      // Reset form
      form.reset();
      
      // Reset all error states
      hideError(nameError);
      hideError(emailError);
      hideError(phoneError);
      hideError(subjectError);
      hideError(messageError);
      hideError(consentError);
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
      }, 3000);

      // Show success message
      showSuccessMessage();
    }, 2000);
  }

  function showSuccessMessage() {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <div class="success-content">
        <span class="material-symbols-rounded success-icon">check_circle</span>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
        <button class="success-close-btn">Close</button>
      </div>
    `;
    
    // Add styles for success message
    successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(16, 185, 129, 0.95);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      max-width: 300px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideInRight 0.3s ease-out;
    `;
    
    // Add success content styles
    const successContent = successMessage.querySelector('.success-content');
    successContent.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: center;
    `;
    
    const successIcon = successMessage.querySelector('.success-icon');
    successIcon.style.cssText = `
      font-size: 2rem;
      margin: 0 auto;
      display: block;
    `;
    
    const successTitle = successMessage.querySelector('h3');
    successTitle.style.cssText = `
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
    `;
    
    const successText = successMessage.querySelector('p');
    successText.style.cssText = `
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    `;
    
    const closeBtn = successMessage.querySelector('.success-close-btn');
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s ease;
      margin-top: 10px;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
      closeBtn.style.transform = 'translateY(-1px)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
      closeBtn.style.transform = 'translateY(0)';
    });

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Add close functionality
    closeBtn.addEventListener('click', () => {
      successMessage.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        successMessage.remove();
        style.remove();
      }, 300);
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          successMessage.remove();
          style.remove();
        }, 300);
      }
    }, 5000);

    // Add to DOM
    document.body.appendChild(successMessage);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced form interactions
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    const input = group.querySelector('input, select, textarea');
    if (input) {
      input.addEventListener('focus', () => {
        group.style.transform = 'translateY(-2px)';
        group.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.2)';
      });
      
      input.addEventListener('blur', () => {
        group.style.transform = 'translateY(0)';
        group.style.boxShadow = 'none';
      });
    }
  });

  // Add typing animation to hero subtitle
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
  }
});