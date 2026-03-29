'use strict';

/**
 * Enhanced JavaScript for Algotricks & Reality Website
 * Modern interactions, animations, and improved functionality
 */

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * DOM Elements
 */
const header = $('.header');
const themeToggle = $('#themeToggle');
const mobileThemeToggle = $('#mobileThemeToggle');
const themeToggleContainer = $('.theme-toggle-container');
const navbar = $('.navbar');
const navToggler = $('[data-nav-toggler]');
const navLinks = $$('.navbar-link');
const propertyList = $('[data-property-list]');
const filterButtons = $$('.filter-btn');
const sortSelect = $('[data-sort-select]');
const favoriteBtns = $$('.fav-btn');
const playBtn = $('.play-btn');
const statItems = $$('.stat-item');
const heroBannerContainer = $('.hero-banner-container');
const newsletterForm = $('.newsletter-form');
const searchForm = $('.search-bar');
const cards = $$('.card');

/**
 * State Management
 */
let allProperties = [];
let currentFilter = 'all';
let isScrolling = false;
let scrollTimeout;

/**
 * Enhanced Theme System
 */
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark-theme';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme, false);
    this.bindEvents();
  }

  setTheme(theme, animate = true) {
    this.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    if (animate) {
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 300);
    }

    this.updateThemeUI();
    localStorage.setItem('theme', theme);
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    this.setTheme(newTheme);
  }

  updateThemeUI() {
    const icon = themeToggle?.querySelector('.material-symbols-rounded');
    const text = themeToggle?.querySelector('.theme-text');
    const mobileIcon = mobileThemeToggle?.querySelector('.material-symbols-rounded');
    const mobileText = mobileThemeToggle?.querySelector('.theme-text');

    if (this.currentTheme === 'dark-theme') {
      icon.textContent = 'dark_mode';
      text.textContent = 'Dark Mode';
      mobileIcon.textContent = 'dark_mode';
      mobileText.textContent = 'Dark Mode';
    } else {
      icon.textContent = 'light_mode';
      text.textContent = 'Light Mode';
      mobileIcon.textContent = 'light_mode';
      mobileText.textContent = 'Light Mode';
    }
  }

  bindEvents() {
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }
}

/**
 * Enhanced Navigation
 */
class NavigationManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Mobile navigation toggle
    if (navToggler) {
      navToggler.addEventListener('click', () => this.toggleMobileNav());
    }

    // Close mobile nav on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileNav());
    });

    // Scroll handling
    window.addEventListener('scroll', () => this.handleScroll());
  }

  toggleMobileNav() {
    navbar.classList.toggle('active');
    navToggler.classList.toggle('active');
    
    // Update icon
    const openIcon = navToggler.querySelector('.open');
    const closeIcon = navToggler.querySelector('.close');
    if (navbar.classList.contains('active')) {
      openIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      openIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  }

  closeMobileNav() {
    navbar.classList.remove('active');
    navToggler.classList.remove('active');
    const openIcon = navToggler.querySelector('.open');
    const closeIcon = navToggler.querySelector('.close');
    openIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }

  handleScroll() {
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
      header.classList.add('scrolled');
      if (themeToggleContainer) {
        themeToggleContainer.style.opacity = '1';
        themeToggleContainer.style.visibility = 'visible';
      }
    } else {
      header.classList.remove('scrolled');
      if (themeToggleContainer) {
        themeToggleContainer.style.opacity = '0';
        themeToggleContainer.style.visibility = 'hidden';
      }
    }
  }
}

/**
 * Enhanced Property System
 */
class PropertyManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadProperties();
    this.bindEvents();
  }

  loadProperties() {
    const propertyCards = $$('.card');
    allProperties = Array.from(propertyCards).map((card, index) => ({
      element: card,
      type: card.dataset.type || 'house',
      price: parseInt(card.dataset.price || '0'),
      bedrooms: parseInt(card.dataset.bedrooms || '0'),
      bathrooms: parseInt(card.dataset.bathrooms || '0'),
      area: parseInt(card.dataset.area || '0'),
      originalOrder: index
    }));
  }

  filterProperties(type) {
    currentFilter = type;
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    allProperties.forEach(property => {
      const shouldShow = type === 'all' || property.type === type;
      
      if (shouldShow) {
        property.element.style.display = 'block';
        property.element.style.opacity = '0';
        setTimeout(() => {
          property.element.style.opacity = '1';
          property.element.style.transform = 'translateY(0)';
        }, 50);
      } else {
        property.element.style.opacity = '0';
        property.element.style.transform = 'translateY(20px)';
        setTimeout(() => {
          property.element.style.display = 'none';
        }, 300);
      }
    });
  }

  sortProperties() {
    const sortBy = sortSelect.value;
    let sortedProperties = [...allProperties];

    sortedProperties.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'bedrooms':
          return b.bedrooms - a.bedrooms;
        case 'bathrooms':
          return b.bathrooms - a.bathrooms;
        case 'area':
          return b.area - a.area;
        case 'default':
        default:
          return a.originalOrder - b.originalOrder;
      }
    });

    // Reorder DOM elements with animation
    const fragment = document.createDocumentFragment();
    sortedProperties.forEach(property => {
      if (property.element.style.display !== 'none') {
        fragment.appendChild(property.element);
      }
    });
    
    propertyList.appendChild(fragment);
    
    // Trigger reflow for animation
    propertyList.style.opacity = '0';
    setTimeout(() => {
      propertyList.style.opacity = '1';
    }, 10);
  }

  bindEvents() {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.filterProperties(e.target.dataset.filter));
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.sortProperties());
    }
  }
}

/**
 * Enhanced Favorites System
 */
class FavoritesManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadFavorites();
    this.bindEvents();
  }

  loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favoriteBtns.forEach(btn => {
      const propertyId = btn.closest('.card').dataset.propertyId;
      if (favorites.includes(propertyId)) {
        this.setFavorite(btn, true);
      }
    });
  }

  toggleFavorite(btn) {
    const propertyId = btn.closest('.card').dataset.propertyId;
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.includes(propertyId);

    if (isFavorite) {
      favorites = favorites.filter(id => id !== propertyId);
      this.setFavorite(btn, false);
      showToast('Removed from favorites', 'error');
    } else {
      favorites.push(propertyId);
      this.setFavorite(btn, true);
      showToast('Added to favorites', 'success');
      createRipple(btn);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  setFavorite(btn, isActive) {
    const icon = btn.querySelector('.material-symbols-rounded');
    if (isActive) {
      btn.classList.add('active');
      icon.textContent = 'favorite';
      icon.style.color = '#ef4444';
    } else {
      btn.classList.remove('active');
      icon.textContent = 'favorite_border';
      icon.style.color = '';
    }
  }

  bindEvents() {
    favoriteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(btn);
      });
    });
  }
}

/**
 * Enhanced Card Interactions
 */
class CardManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    cards.forEach(card => {
      // Enhanced hover effects
      card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
      card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
      
      // Click animation
      card.addEventListener('click', () => this.handleCardClick(card));
      
      // Add parallax effect
      card.addEventListener('mousemove', (e) => this.handleCardParallax(card, e));
    });
  }

  handleCardHover(card, isHovering) {
    const img = card.querySelector('.img-cover');
    const content = card.querySelector('.card-content');
    
    if (isHovering) {
      card.style.transform = 'translateY(-12px) scale(1.02)';
      card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
      if (img) img.style.transform = 'scale(1.1)';
      if (content) content.style.transform = 'translateY(-4px)';
    } else {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
      if (img) img.style.transform = 'scale(1)';
      if (content) content.style.transform = 'translateY(0)';
    }
  }

  handleCardClick(card) {
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = 'translateY(-12px) scale(1.02)';
    }, 150);
  }

  handleCardParallax(card, e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `translateY(-12px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
}

/**
 * Enhanced Statistics Animation
 */
class StatsManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (heroBannerContainer) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStats();
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(heroBannerContainer);
    }
  }

  animateStats() {
    statItems.forEach(item => {
      const number = item.querySelector('.stat-number');
      const target = parseInt(number.textContent.replace(/[^\d]/g, ''));
      let count = 0;
      const increment = target / 50;
      
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        number.textContent = Math.floor(count) + (number.textContent.includes('+') ? '+' : '');
      }, 20);
    });
  }
}

/**
 * Enhanced Video Modal
 */
class VideoManager {
  constructor() {
    this.init();
  }

  init() {
    if (playBtn) {
      playBtn.addEventListener('click', () => this.openVideoModal());
    }
  }

  openVideoModal() {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-btn" aria-label="Close modal">
          <span class="material-symbols-rounded">close</span>
        </button>
        <div class="video-wrapper">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  title="YouTube video player" frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen></iframe>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => this.closeVideoModal(modal));
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeVideoModal(modal);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeVideoModal(modal);
      }
    });
  }

  closeVideoModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }, 300);
  }
}

/**
 * Enhanced Form Handling
 */
class FormManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }
    
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => this.handleSearchSubmit(e));
    }
  }

  handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    if (!this.isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Simulate API call
    showToast('Thank you for subscribing!', 'success');
    newsletterForm.reset();
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();
    
    formData.forEach((value, key) => {
      if (value) searchParams.append(key, value);
    });

    // Simulate search
    showToast('Searching properties...', 'success');
    
    // Add search animation
    const searchBtn = searchForm.querySelector('.search-btn');
    searchBtn.disabled = true;
    searchBtn.innerHTML = `
      <span class="material-symbols-rounded">search</span>
      <span class="label-medium">Searching...</span>
    `;
    
    setTimeout(() => {
      searchBtn.disabled = false;
      searchBtn.innerHTML = `
        <span class="material-symbols-rounded">search</span>
        <span class="label-medium">Search Properties</span>
      `;
    }, 2000);
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

/**
 * Enhanced Toast System
 */
class ToastManager {
  static showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${this.getIcon(type)}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close">
        <span class="material-symbols-rounded">close</span>
      </button>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto hide after 3 seconds
    const hideTimeout = setTimeout(() => {
      this.hideToast(toast);
    }, 3000);

    // Close on button click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(hideTimeout);
      this.hideToast(toast);
    });
  }

  static hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  static getIcon(type) {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'info': return 'info';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
}

/**
 * Enhanced Scroll Animations
 */
class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.initIntersectionObservers();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      this.handleScrollAnimations();
    });
  }

  initIntersectionObservers() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // Observer for fade-in animations
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer for parallax effects
    const parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleParallax(entry.target, entry.boundingClientRect);
        }
      });
    }, observerOptions);

    // Apply observers to elements
    document.querySelectorAll('.scroll-fade-in, .card, .feature-item, .testimonial-card').forEach(el => {
      fadeInObserver.observe(el);
    });

    document.querySelectorAll('.parallax-bg').forEach(el => {
      parallaxObserver.observe(el);
    });
  }

  handleScrollAnimations() {
    // Add scroll classes to elements
    const scrollElements = document.querySelectorAll('.scroll-fade-in');
    scrollElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible && !el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }

  handleParallax(element, rect) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    element.style.transform = `translateY(${rate}px)`;
  }
}

/**
 * Enhanced Ripple Effect
 */
function createRipple(element, event = null) {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event ? event.clientX - rect.left - size / 2 : rect.width / 2;
  const y = event ? event.clientY - rect.top - size / 2 : rect.height / 2;
  
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  // Remove existing ripples
  const existingRipples = element.querySelectorAll('.ripple');
  existingRipples.forEach(r => r.remove());
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * Enhanced Smooth Scrolling
 */
class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
    });
  }

  handleSmoothScroll(e, anchor) {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

/**
 * Utility Functions
 */
function showToast(message, type = 'success') {
  ToastManager.showToast(message, type);
}

/**
 * Initialize All Systems
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  const themeManager = new ThemeManager();
  const navigationManager = new NavigationManager();
  const propertyManager = new PropertyManager();
  const favoritesManager = new FavoritesManager();
  const cardManager = new CardManager();
  const statsManager = new StatsManager();
  const videoManager = new VideoManager();
  const formManager = new FormManager();
  const scrollManager = new ScrollManager();
  const smoothScrollManager = new SmoothScrollManager();

  // Initialize AOS if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      offset: 100,
      delay: 0,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }

  // Add loading animation
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // Add theme change listener for dynamic updates
  window.addEventListener('themechange', (e) => {
    // Update any theme-dependent elements
    console.log('Theme changed to:', e.detail.theme);
  });
});
