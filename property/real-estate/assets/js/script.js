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
    
    // Get search values
    const location = document.getElementById('location').value.trim();
    const propertyType = document.getElementById('propertyType').value;
    const priceRange = document.getElementById('priceRange').value;
    
    // Validation
    if (!location && !propertyType && !priceRange) {
      showToast('Please fill in at least one search field', 'warning');
      return;
    }
    
    // Show loading state
    const searchBtn = searchForm.querySelector('.search-btn');
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = `
      <span class="material-symbols-rounded">search</span>
      <span class="label-medium">Searching...</span>
    `;
    searchBtn.disabled = true;
    
    // Perform search with delay to simulate backend processing
    setTimeout(() => {
      // Reset button
      searchBtn.innerHTML = originalText;
      searchBtn.disabled = false;
      
      // Perform search
      const results = this.performSearch(location, propertyType, priceRange);
      
      // Display results
      this.displaySearchResults(results, location, propertyType, priceRange);
      
      // Show success message
      const searchSummary = this.getSearchSummary(location, propertyType, priceRange);
      showToast(`Found ${results.length} properties matching: ${searchSummary}`, 'success');
      
      // Scroll to properties section
      const propertiesSection = document.querySelector('.property');
      if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  }

  // Enhanced search function with sample data
  performSearch(location, propertyType, priceRange) {
    // Sample property data for search functionality
    const sampleProperties = [
      {
        id: 1,
        title: 'Modern 3-Bedroom Villa',
        location: 'Downtown',
        type: 'House',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop',
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2500,
        features: ['Swimming Pool', 'Garden', 'Garage']
      },
      {
        id: 2,
        title: 'Luxury Apartment',
        location: 'City Center',
        type: 'Apartment',
        price: 280000,
        image: 'https://images.unsplash.com/photo-1560185127-6f61249464d5?w=500&auto=format&fit=crop',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        features: ['Gym', 'Pool', 'Security']
      },
      {
        id: 3,
        title: 'Cozy Studio',
        location: 'Suburb',
        type: 'Studio',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 600,
        features: ['Balcony', 'Parking']
      },
      {
        id: 4,
        title: 'Family Home',
        location: 'Downtown',
        type: 'House',
        price: 650000,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 3200,
        features: ['Large Garden', 'Garage', 'Fireplace']
      },
      {
        id: 5,
        title: 'Penthouse Suite',
        location: 'City Center',
        type: 'Apartment',
        price: 950000,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop',
        bedrooms: 3,
        bathrooms: 3,
        sqft: 2800,
        features: ['Terrace', 'Concierge', 'Gym']
      },
      {
        id: 6,
        title: 'Suburban Bungalow',
        location: 'Suburb',
        type: 'House',
        price: 320000,
        image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&auto=format&fit=crop',
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        features: ['Backyard', 'Garage']
      },
      {
        id: 7,
        title: 'Modern Loft',
        location: 'Downtown',
        type: 'Apartment',
        price: 220000,
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 800,
        features: ['High Ceilings', 'Open Plan']
      },
      {
        id: 8,
        title: 'Luxury Villa',
        location: 'City Center',
        type: 'House',
        price: 1200000,
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&auto=format&fit=crop',
        bedrooms: 5,
        bathrooms: 4,
        sqft: 4500,
        features: ['Pool', 'Garden', 'Security', 'Garage']
      }
    ];
    
    let results = [...sampleProperties];
    
    // Filter by location
    if (location) {
      results = results.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Filter by property type
    if (propertyType && propertyType !== 'all') {
      results = results.filter(property => 
        property.type.toLowerCase() === propertyType.toLowerCase()
      );
    }
    
    // Filter by price range
    if (priceRange) {
      const [minPrice, maxPrice] = this.getPriceRange(priceRange);
      results = results.filter(property => 
        property.price >= minPrice && property.price <= maxPrice
      );
    }
    
    return results;
  }
  
  // Get price range values
  getPriceRange(range) {
    switch(range) {
      case 'under-100k':
        return [0, 100000];
      case '100k-300k':
        return [100000, 300000];
      case '300k-500k':
        return [300000, 500000];
      case '500k-1m':
        return [500000, 1000000];
      case 'over-1m':
        return [1000000, Infinity];
      default:
        return [0, Infinity];
    }
  }
  
  // Display search results
  displaySearchResults(results, location, propertyType, priceRange) {
    const propertyList = document.querySelector('.property-list');
    const titleWrapper = document.querySelector('.title-wrapper');
    
    if (!propertyList) return;
    
    // Update title
    const searchSummary = this.getSearchSummary(location, propertyType, priceRange);
    const titleElement = titleWrapper ? titleWrapper.querySelector('.section-title') : null;
    if (titleElement) {
      titleElement.textContent = `Search Results for: ${searchSummary}`;
    }
    
    // Clear existing properties
    propertyList.innerHTML = '';
    
    if (results.length === 0) {
      // No results found
      const noResultsCard = document.createElement('div');
      noResultsCard.className = 'card';
      noResultsCard.style.gridColumn = '1 / -1';
      noResultsCard.style.textAlign = 'center';
      noResultsCard.style.padding = '60px 20px';
      noResultsCard.innerHTML = `
        <div style="margin-bottom: 20px;">
          <span class="material-symbols-rounded" style="font-size: 4rem; color: var(--text-tertiary);">search_off</span>
        </div>
        <h3 style="margin: 0 0 10px 0; color: var(--text-primary);">No Properties Found</h3>
        <p style="margin: 0; color: var(--text-secondary);">We couldn't find any properties matching your criteria. Try adjusting your search filters.</p>
        <div style="margin-top: 30px;">
          <button class="btn btn-outline" onclick="resetSearch()" style="margin-right: 10px;">Reset Search</button>
          <button class="btn btn-fill" onclick="showAllProperties()">View All Properties</button>
        </div>
      `;
      propertyList.appendChild(noResultsCard);
    } else {
      // Display results
      results.forEach(property => {
        const propertyCard = this.createPropertyCard(property);
        propertyList.appendChild(propertyCard);
      });
    }
  }
  
  // Create property card
  createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-banner">
        <img src="${property.image}" alt="${property.title}" class="img-cover">
        <div class="badge" style="position: absolute; top: 16px; left: 16px;">${property.type}</div>
        <button class="icon-btn" style="position: absolute; top: 16px; right: 16px;">
          <span class="material-symbols-rounded">favorite</span>
        </button>
      </div>
      <div class="card-content">
        <h3 class="card-title">${property.title}</h3>
        <p class="card-text">${property.location} • ${property.bedrooms} Beds • ${property.bathrooms} Baths • ${property.sqft} sqft</p>
        <div class="card-meta-list">
          <div class="meta-item">
            <span class="material-symbols-rounded meta-icon">location_on</span>
            <span>${property.location}</span>
          </div>
          <div class="meta-item">
            <span class="material-symbols-rounded meta-icon">bed</span>
            <span>${property.bedrooms} Beds</span>
          </div>
          <div class="meta-item">
            <span class="material-symbols-rounded meta-icon">bathtub</span>
            <span>${property.bathrooms} Baths</span>
          </div>
        </div>
        <div class="card-features">
          ${property.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
        <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary-100);">$${property.price.toLocaleString()}</div>
            <div style="font-size: 1.2rem; color: var(--text-tertiary);">Total Price</div>
          </div>
          <button class="btn btn-fill" onclick="viewPropertyDetails(${property.id})">
            <span class="material-symbols-rounded">visibility</span>
            View Details
          </button>
        </div>
      </div>
    `;
    return card;
  }
  
  // Get search summary for display
  getSearchSummary(location, propertyType, priceRange) {
    const parts = [];
    
    if (location) parts.push(`Location: ${location}`);
    if (propertyType && propertyType !== 'all') parts.push(`Type: ${propertyType}`);
    if (priceRange) {
      const rangeText = this.getPriceRangeText(priceRange);
      parts.push(`Price: ${rangeText}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'All Properties';
  }
  
  // Get human-readable price range text
  getPriceRangeText(range) {
    switch(range) {
      case 'under-100k': return 'Under $100K';
      case '100k-300k': return '$100K - $300K';
      case '300k-500k': return '$300K - $500K';
      case '500k-1m': return '$500K - $1M';
      case 'over-1m': return 'Over $1M';
      default: return 'Any Price';
    }
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
 * Advanced Scroll-Based UI/UX Manager
 */
class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.initIntersectionObservers();
    this.initHeroScrollBehavior();
    this.initParallaxEffects();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      this.handleScrollAnimations();
      this.handleHeroScrollBehavior();
      this.handleParallaxEffects();
    });
  }

  initHeroScrollBehavior() {
    this.hero = document.querySelector('.hero');
    this.lastScrollY = window.scrollY;
    this.isScrolling = false;
    this.scrollTimeout = null;
  }

  handleHeroScrollBehavior() {
    if (!this.hero) return;

    const currentScrollY = window.scrollY;
    const scrollThreshold = 50;
    const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';

    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Handle scroll direction
    if (currentScrollY > scrollThreshold) {
      if (scrollDirection === 'down') {
        this.hero.classList.remove('scrolled-down');
        this.hero.classList.add('scrolled-up');
      } else {
        this.hero.classList.remove('scrolled-up');
        this.hero.classList.add('scrolled-down');
      }
    } else {
      this.hero.classList.remove('scrolled-up', 'scrolled-down');
    }

    this.lastScrollY = currentScrollY;

    // Reset after scroll stops
    this.scrollTimeout = setTimeout(() => {
      if (currentScrollY > scrollThreshold) {
        this.hero.classList.remove('scrolled-up');
        this.hero.classList.add('scrolled-down');
      }
    }, 150);
  }

  initParallaxEffects() {
    this.parallaxElements = document.querySelectorAll('.parallax-bg, .hero-banner, .hero-content, .hero-stats');
    this.parallaxData = new Map();
  }

  handleParallaxEffects() {
    const scrolled = window.scrollY;
    const scrollPercent = Math.min(scrolled / (document.body.scrollHeight - window.innerHeight), 1);

    // Hero content parallax
    const heroContent = document.querySelector('.hero-content');
    const heroBanner = document.querySelector('.hero-banner-container');
    const heroStats = document.querySelector('.hero-stats');

    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * -0.2}px)`;
    }

    if (heroBanner) {
      heroBanner.style.transform = `translateY(${scrolled * -0.3}px) scale(${1 - (scrollPercent * 0.05)})`;
    }

    if (heroStats) {
      heroStats.style.transform = `translateY(${scrolled * -0.15}px)`;
    }

    // Background parallax
    this.parallaxElements.forEach(el => {
      const speed = el.dataset.parallaxSpeed || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }

  initIntersectionObservers() {
    // Premium Properties Section Observer
    const propertyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animatePropertySection(entry.target);
          propertyObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    // Staggered Card Animation Observer
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          this.animateCard(entry.target, index);
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    // Scroll Fade In Observer
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    // Apply observers
    const propertySection = document.querySelector('.property');
    if (propertySection) {
      propertyObserver.observe(propertySection);
    }

    document.querySelectorAll('.card').forEach(card => {
      cardObserver.observe(card);
    });

    document.querySelectorAll('.scroll-fade-in, .feature-item, .testimonial-card, .stat-item, .cta-title, .cta-text').forEach(el => {
      fadeInObserver.observe(el);
    });
  }

  animatePropertySection(section) {
    const cards = section.querySelectorAll('.card');
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');
    const filterControls = section.querySelector('.filter-controls');
    const sortSelect = section.querySelector('.sort-select');

    // Animate title and subtitle
    if (title) {
      this.animateElement(title, {
        from: { opacity: 0, transform: 'translateY(30px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }

    if (subtitle) {
      this.animateElement(subtitle, {
        from: { opacity: 0, transform: 'translateY(30px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        duration: 800,
        delay: 100,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }

    // Animate filter controls
    if (filterControls) {
      this.animateElement(filterControls, {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        duration: 600,
        delay: 200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }

    if (sortSelect) {
      this.animateElement(sortSelect, {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        duration: 600,
        delay: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }

    // Stagger card animations
    cards.forEach((card, index) => {
      this.animateElement(card, {
        from: { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
        to: { opacity: 1, transform: 'translateY(0) scale(1)' },
        duration: 800,
        delay: 200 + (index * 100),
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
    });
  }

  animateCard(card, index) {
    this.animateElement(card, {
      from: { opacity: 0, transform: 'translateY(30px) scale(0.98)' },
      to: { opacity: 1, transform: 'translateY(0) scale(1)' },
      duration: 600,
      delay: index * 50,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }

  animateElement(element, config) {
    const { from, to, duration, delay = 0, easing } = config;
    
    element.style.transition = `all ${duration}ms ${easing}`;
    element.style.opacity = from.opacity;
    element.style.transform = from.transform;
    
    setTimeout(() => {
      element.style.opacity = to.opacity;
      element.style.transform = to.transform;
    }, delay);
  }

  handleScrollAnimations() {
    // Enhanced scroll detection for performance
    const scrollElements = document.querySelectorAll('.scroll-fade-in');
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    scrollElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;
      
      if (isVisible && !el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
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
 * Global Functions for Search Functionality
 */
window.resetSearch = function() {
  document.getElementById('location').value = '';
  document.getElementById('propertyType').value = 'all';
  document.getElementById('priceRange').value = '';
  
  // Trigger search with empty values to show all properties
  const searchForm = document.querySelector('.search-bar');
  searchForm.dispatchEvent(new Event('submit'));
};

window.showAllProperties = function() {
  // Show all properties
  const formManager = new FormManager();
  const sampleProperties = [
    {
      id: 1,
      title: 'Modern 3-Bedroom Villa',
      location: 'Downtown',
      type: 'House',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2500,
      features: ['Swimming Pool', 'Garden', 'Garage']
    },
    {
      id: 2,
      title: 'Luxury Apartment',
      location: 'City Center',
      type: 'Apartment',
      price: 280000,
      image: 'https://images.unsplash.com/photo-1560185127-6f61249464d5?w=500&auto=format&fit=crop',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      features: ['Gym', 'Pool', 'Security']
    },
    {
      id: 3,
      title: 'Cozy Studio',
      location: 'Suburb',
      type: 'Studio',
      price: 150000,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      features: ['Balcony', 'Parking']
    },
    {
      id: 4,
      title: 'Family Home',
      location: 'Downtown',
      type: 'House',
      price: 650000,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3200,
      features: ['Large Garden', 'Garage', 'Fireplace']
    },
    {
      id: 5,
      title: 'Penthouse Suite',
      location: 'City Center',
      type: 'Apartment',
      price: 950000,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2800,
      features: ['Terrace', 'Concierge', 'Gym']
    },
    {
      id: 6,
      title: 'Suburban Bungalow',
      location: 'Suburb',
      type: 'House',
      price: 320000,
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      features: ['Backyard', 'Garage']
    },
    {
      id: 7,
      title: 'Modern Loft',
      location: 'Downtown',
      type: 'Apartment',
      price: 220000,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 800,
      features: ['High Ceilings', 'Open Plan']
    },
    {
      id: 8,
      title: 'Luxury Villa',
      location: 'City Center',
      type: 'House',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&auto=format&fit=crop',
      bedrooms: 5,
      bathrooms: 4,
      sqft: 4500,
      features: ['Pool', 'Garden', 'Security', 'Garage']
    }
  ];
  
  formManager.displaySearchResults(sampleProperties, '', 'all', '');
  showToast('Showing all available properties', 'info');
};

window.viewPropertyDetails = function(propertyId) {
  const sampleProperties = [
    {
      id: 1,
      title: 'Modern 3-Bedroom Villa',
      location: 'Downtown',
      type: 'House',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2500,
      features: ['Swimming Pool', 'Garden', 'Garage']
    },
    {
      id: 2,
      title: 'Luxury Apartment',
      location: 'City Center',
      type: 'Apartment',
      price: 280000,
      image: 'https://images.unsplash.com/photo-1560185127-6f61249464d5?w=500&auto=format&fit=crop',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      features: ['Gym', 'Pool', 'Security']
    },
    {
      id: 3,
      title: 'Cozy Studio',
      location: 'Suburb',
      type: 'Studio',
      price: 150000,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      features: ['Balcony', 'Parking']
    },
    {
      id: 4,
      title: 'Family Home',
      location: 'Downtown',
      type: 'House',
      price: 650000,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3200,
      features: ['Large Garden', 'Garage', 'Fireplace']
    },
    {
      id: 5,
      title: 'Penthouse Suite',
      location: 'City Center',
      type: 'Apartment',
      price: 950000,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2800,
      features: ['Terrace', 'Concierge', 'Gym']
    },
    {
      id: 6,
      title: 'Suburban Bungalow',
      location: 'Suburb',
      type: 'House',
      price: 320000,
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      features: ['Backyard', 'Garage']
    },
    {
      id: 7,
      title: 'Modern Loft',
      location: 'Downtown',
      type: 'Apartment',
      price: 220000,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 800,
      features: ['High Ceilings', 'Open Plan']
    },
    {
      id: 8,
      title: 'Luxury Villa',
      location: 'City Center',
      type: 'House',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&auto=format&fit=crop',
      bedrooms: 5,
      bathrooms: 4,
      sqft: 4500,
      features: ['Pool', 'Garden', 'Security', 'Garage']
    }
  ];
  
  const property = sampleProperties.find(p => p.id === propertyId);
  if (property) {
    showToast(`Viewing details for ${property.title}`, 'info');
    // In a real application, this would navigate to a property detail page
    console.log('Property Details:', property);
  }
};

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
