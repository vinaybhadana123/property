// Gallery JavaScript for Premium Real Estate Gallery
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Gallery
  initGallery();
});

function initGallery() {
  // Initialize filtering
  initFilters();
  
  // Initialize lightbox
  initLightbox();
  
  // Initialize smooth scrolling for filters
  initSmoothScrolling();
  
  // Initialize header scroll effect
  initHeaderScroll();
}

// Filter Functionality
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const filterValue = e.target.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      // Filter items
      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
          item.style.animation = 'fadeOut 0.3s ease forwards';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      // Scroll to gallery section smoothly
      const gallerySection = document.querySelector('.gallery-grid-section');
      gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Lightbox Functionality
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  let currentIndex = 0;
  let visibleItems = [];

  // Open lightbox when gallery item is clicked
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    // Get all visible items for navigation
    updateVisibleItems();
    
    // Find the correct index in visible items
    currentIndex = visibleItems.indexOf(index);
    if (currentIndex === -1) {
      currentIndex = 0;
    }
    
    const item = document.querySelectorAll('.gallery-item')[index];
    const img = item.querySelector('img');
    const title = item.querySelector('.overlay-content h3').textContent;
    const category = item.querySelector('.overlay-category').textContent;
    
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function updateVisibleItems() {
    visibleItems = [];
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      if (item.style.display !== 'none') {
        visibleItems.push(index);
      }
    });
  }

  function navigateLightbox(direction) {
    if (visibleItems.length === 0) return;
    
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % visibleItems.length;
    } else {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    }
    
    const itemIndex = visibleItems[currentIndex];
    const item = document.querySelectorAll('.gallery-item')[itemIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.overlay-content h3').textContent;
    const category = item.querySelector('.overlay-category').textContent;
    
    lightboxImage.style.opacity = '0';
    setTimeout(() => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category;
      lightboxImage.style.opacity = '1';
    }, 150);
  }

  // Event Listeners
  lightboxClose.addEventListener('click', closeLightbox);
  
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox('prev');
  });
  
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox('next');
  });

  // Close lightbox when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    }
  });

  // Touch swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    if (!lightbox.classList.contains('active')) return;
    
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        navigateLightbox('next');
      } else {
        navigateLightbox('prev');
      }
    }
  }
}

// Smooth Scrolling for Filters
function initSmoothScrolling() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add ripple effect
      createRipple(e.target, e);
      
      // Smooth scroll to gallery after filter
      setTimeout(() => {
        const gallerySection = document.querySelector('.gallery-grid-section');
        gallerySection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    });
  });
}

// Ripple Effect for Buttons
function createRipple(button, event) {
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255, 255, 255, 0.6)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 0.6s linear';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.pointerEvents = 'none';
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Header Scroll Effect
function initHeaderScroll() {
  const header = document.querySelector('.gallery-header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });
}

// Enhanced Image Loading
function initImageLoading() {
  const images = document.querySelectorAll('.gallery-image img');
  
  images.forEach(img => {
    // Add loading animation
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    
    // Add error handling
    img.addEventListener('error', () => {
      img.src = '../assets/images/placeholder.jpg'; // Fallback image
      img.alt = 'Image not available';
    });
  });
}

// Performance Optimization - Lazy Loading
function initLazyLoading() {
  const images = document.querySelectorAll('.gallery-image img');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Accessibility Enhancements
function initAccessibility() {
  // Add ARIA labels
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'View property image');
    
    // Keyboard support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
  
  // Focus management for lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  
  lightbox.addEventListener('shown.bs.modal', () => {
    lightboxClose.focus();
  });
  
  lightbox.addEventListener('hidden.bs.modal', () => {
    document.activeElement.blur();
  });
}

// Initialize all accessibility features
initAccessibility();