class Header {
  constructor() {
    this.header = document.querySelector('header');
    this.navContainer = document.querySelector('.nav-container');
    this.searchInput = document.getElementById('search');
    this.hamburger = document.querySelector('.hamburger');
    this.navList = document.querySelector('nav ul');
    this.isMobileMenuOpen = false;
    this.lastScrollPosition = 0;
    this.scrollThreshold = 100;
    this.searchDebounceTimeout = null;
    this.searchDebounceDelay = 300;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthState();
    this.setupIntersectionObserver();
  }

  setupEventListeners() {
    // Mobile menu toggle
    this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    
    // Search functionality with debounce
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchDebounceTimeout);
      this.searchDebounceTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, this.searchDebounceDelay);
    });

    // Hide header on scroll down, show on scroll up
    window.addEventListener('scroll', () => this.handleScroll());

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMobileMenuOpen && !e.target.closest('nav') && !e.target.closest('.hamburger')) {
        this.closeMobileMenu();
      }
    });

    // Keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.navList.classList.toggle('active', this.isMobileMenuOpen);
    this.hamburger.classList.toggle('active', this.isMobileMenuOpen);
    document.body.classList.toggle('no-scroll', this.isMobileMenuOpen);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.navList.classList.remove('active');
    this.hamburger.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  handleScroll() {
    const currentScrollPosition = window.pageYOffset;
    
    if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > this.scrollThreshold) {
      // Scrolling down
      this.header.classList.add('hidden');
    } else {
      // Scrolling up
      this.header.classList.remove('hidden');
    }
    
    // Add/remove background based on scroll position
    if (currentScrollPosition > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    this.lastScrollPosition = currentScrollPosition;
  }

  handleSearch(query) {
    if (query.length > 2) {
      // In a real app, you would fetch search results here
      console.log('Searching for:', query);
      // Example: this.fetchSearchResults(query);
    }
  }

  async checkAuthState() {
    try {
      // In a real app, you would check authentication state
      // const isAuthenticated = await authService.isAuthenticated();
      const isAuthenticated = false; // Mock value
      this.updateAuthUI(isAuthenticated);
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }

  updateAuthUI(isAuthenticated) {
    const authLinks = document.querySelectorAll('nav ul li a[href="signin.html"], nav ul li a[href="register.html"]');
    
    if (isAuthenticated) {
      // Replace auth links with profile/dashboard
      authLinks.forEach(link => link.parentElement.remove());
      
      const profileLi = document.createElement('li');
      profileLi.innerHTML = `
        <div class="profile-dropdown">
          <a href="/profile" class="profile-link">
            <img src="/assets/images/profile-placeholder.jpg" alt="Profile" class="profile-pic">
          </a>
          <div class="dropdown-content">
            <a href="/dashboard">Dashboard</a>
            <a href="/settings">Settings</a>
            <a href="/logout">Logout</a>
          </div>
        </div>
      `;
      this.navList.appendChild(profileLi);
    }
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.header.classList.add('visible');
        } else {
          this.header.classList.remove('visible');
        }
      });
    }, observerOptions);

    observer.observe(this.header);
  }

  // Additional method for dynamic category loading
  async loadCategories() {
    try {
      // Fetch categories from API
      // const categories = await apiService.getCategories();
      const categories = [
        { id: 1, name: 'Web Development' },
        { id: 2, name: 'Data Science' },
        { id: 3, name: 'Mobile Development' }
      ]; // Mock data
      
      const categoriesLink = document.querySelector('a[href="#categories"]');
      if (categoriesLink) {
        const parentLi = categoriesLink.parentElement;
        
        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'categories-dropdown';
        
        // Create dropdown content
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        
        // Populate with categories
        categories.forEach(category => {
          const categoryLink = document.createElement('a');
          categoryLink.href = `/category/${category.id}`;
          categoryLink.textContent = category.name;
          dropdownContent.appendChild(categoryLink);
        });
        
        dropdown.appendChild(dropdownContent);
        parentLi.appendChild(dropdown);
        
        // Add hover events
        parentLi.addEventListener('mouseenter', () => {
          dropdownContent.style.display = 'block';
        });
        
        parentLi.addEventListener('mouseleave', () => {
          dropdownContent.style.display = 'none';
        });
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
}

// Initialize the header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const header = new Header();
  
  // Optional: Load categories dynamically
  // header.loadCategories();
});


class HeroSection {
    constructor() {
      this.hero = document.querySelector('.hero');
      this.heroContent = document.querySelector('.hero-content');
      this.ctaButton = document.querySelector('.cta-button');
      this.backgroundImages = [
        'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")',
        'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")',
        'url("https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80")'
      ];
      this.currentBgIndex = 0;
      this.typingElements = {
        h1: 'Start Your Freshman Journey with Confidence',
        p: 'Free courses in Maths, English, Physics, Geography, Psychology, and more, designed for freshman students.'
      };
      
      this.init();
    }
  
    init() {
      this.setupEventListeners();
      this.animateOnLoad();
      this.startBackgroundRotation();
      
      // Only run typing effect if content is empty (for demo purposes)
      if (!this.heroContent.querySelector('h1').textContent) {
        this.typeContent();
      }
    }
  
    setupEventListeners() {
      // Parallax effect on mouse move
      this.hero.addEventListener('mousemove', (e) => {
        this.handleParallax(e);
      });
  
      // CTA button effects
      this.ctaButton.addEventListener('mouseenter', () => {
        this.animateButton(true);
      });
  
      this.ctaButton.addEventListener('mouseleave', () => {
        this.animateButton(false);
      });
  
      // Intersection Observer for scroll effects
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.handleScrollIntoView();
          }
        });
      }, { threshold: 0.5 });
  
      observer.observe(this.hero);
    }
  
    animateOnLoad() {
      gsap.from(this.heroContent.children, {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out"
      });
    }
  
    handleParallax(e) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      gsap.to(this.heroContent, {
        x: (x - 0.5) * 20,
        y: (y - 0.5) * 10,
        duration: 1,
        ease: "power1.out"
      });
    }
  
    animateButton(isHovering) {
      if (isHovering) {
        gsap.to(this.ctaButton, {
          y: -5,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(this.ctaButton, {
          y: 0,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  
    startBackgroundRotation() {
      setInterval(() => {
        this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
        this.changeBackground(this.currentBgIndex);
      }, 8000);
    }
  
    changeBackground(index) {
      gsap.to(this.hero, {
        backgroundImage: this.backgroundImages[index],
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => {
          this.hero.style.transition = 'background-image 1.5s ease-in-out';
        }
      });
    }
  
    typeContent() {
      const h1Element = this.heroContent.querySelector('h1');
      const pElement = this.heroContent.querySelector('p');
      
      h1Element.textContent = '';
      pElement.textContent = '';
      
      this.typeWriter(h1Element, this.typingElements.h1, () => {
        this.typeWriter(pElement, this.typingElements.p);
      });
    }
  
    typeWriter(element, text, callback) {
      let i = 0;
      const speed = 20;
      
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else if (callback) {
          callback();
        }
      }
      
      type();
    }
  
    handleScrollIntoView() {
      // Add any scroll-triggered animations here
      gsap.to(this.heroContent, {
        scale: 1.02,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new HeroSection();
    
    // Load GSAP if not already loaded
    if (typeof gsap === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
      document.head.appendChild(script);
      script.onload = () => new HeroSection();
    }
  });

// linkign section


  document.addEventListener('DOMContentLoaded', () => {
    const categoryItems = document.querySelectorAll('.category-item');
    const coursesSection = document.querySelector('#courses');

    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // Smooth scroll to courses section
            coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});





document.addEventListener('DOMContentLoaded', () => {
    const categoryItems = document.querySelectorAll('.category-item');
    const courseCards = document.querySelectorAll('.course-card');
    
    // Set 'All' as active by default
    const allCategory = document.querySelector('.category-item[data-filter="all"]');
    if (allCategory) {
        allCategory.classList.add('active');
    }
    
    // Show all courses by default
    courseCards.forEach(card => {
        card.style.display = 'block';
    });

    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = item.getAttribute('data-filter');
            
            // Remove active class from all categories
            categoryItems.forEach(cat => {
                cat.classList.remove('active');
            });
            // Add active class to clicked category
            item.classList.add('active');
            
            if (filter === 'all') {
                // Show all cards
                courseCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                // Hide all cards first
                courseCards.forEach(card => {
                    card.style.display = 'none';
                });
                // Show only matching cards
                const matchingCards = document.querySelectorAll(`.course-card[data-subject="${filter}"]`);
                matchingCards.forEach(card => {
                    card.style.display = 'block';
                });
            }
            
            // Scroll to courses section
            const coursesSection = document.querySelector('#courses');
            if (coursesSection) {
                coursesSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
});

// Add this CSS to your stylesheet
const styleElement = document.createElement('style');
styleElement.textContent = `
    .category-item.active {
        background-color: #4a90e2;
        color: white;
        font-weight: bold;
    }
    .course-card {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(styleElement);
// Testimonial Carousel
const carousel = document.querySelector('.testimonial-grid');
const prevButton = document.getElementById('prev-slide');
const nextButton = document.getElementById('next-slide');
const dotsContainer = document.querySelector('.carousel-dots');
const cards = document.querySelectorAll('.testimonial-card');
const totalCards = cards.length;
let currentIndex = 0;
let cardsPerView = 3; // Default for desktop
let autoSlideInterval;
let touchStartX = 0;
let touchEndX = 0;

// Calculate cards per view based on screen size
function updateCardsPerView() {
    if (window.innerWidth <= 768) {
        cardsPerView = 1;
    } else if (window.innerWidth <= 1024) {
        cardsPerView = 2;
    } else {
        cardsPerView = 3;
    }
    updateCarousel();
    createDots();
}

// Create pagination dots
function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = Math.ceil(totalCards / cardsPerView);
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === Math.floor(currentIndex / cardsPerView)) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            currentIndex = i * cardsPerView;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }
}

// Update carousel position
function updateCarousel() {
    const maxIndex = totalCards - cardsPerView;
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    if (currentIndex < 0) {
        currentIndex = 0;
    }
    const translateX = -(currentIndex * (100 / cardsPerView));
    carousel.style.transform = `translateX(${translateX}%)`;

    // Update active card styles
    cards.forEach((card, index) => {
        card.classList.toggle('active', index >= currentIndex && index < currentIndex + cardsPerView);
    });

    // Update active dot
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === Math.floor(currentIndex / cardsPerView));
    });
}

// Auto-slide every 4 seconds
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentIndex += cardsPerView;
        if (currentIndex >= totalCards) {
            currentIndex = 0;
        }
        updateCarousel();
    }, 4000);
}

// Pause auto-slide on hover
document.querySelector('.testimonial-carousel').addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

document.querySelector('.testimonial-carousel').addEventListener('mouseleave', () => {
    startAutoSlide();
});

// Navigation buttons
nextButton.addEventListener('click', () => {
    currentIndex += cardsPerView;
    if (currentIndex >= totalCards) {
        currentIndex = 0;
    }
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    currentIndex -= cardsPerView;
    if (currentIndex < 0) {
        currentIndex = Math.max(0, totalCards - cardsPerView);
    }
    updateCarousel();
});

// Touch swipe support
carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;
    if (swipeDistance > 50) {
        // Swipe left
        currentIndex += cardsPerView;
        if (currentIndex >= totalCards) {
            currentIndex = 0;
        }
        updateCarousel();
    } else if (swipeDistance < -50) {
        // Swipe right
        currentIndex -= cardsPerView;
        if (currentIndex < 0) {
            currentIndex = Math.max(0, totalCards - cardsPerView);
        }
        updateCarousel();
    }
});

// Initialize carousel
updateCardsPerView();
startAutoSlide();

// Update on resize
window.addEventListener('resize', updateCardsPerView);
document.addEventListener('DOMContentLoaded', () => {
// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');
hamburger.addEventListener('click', () => {
navMenu.classList.toggle('active');
hamburger.querySelector('i').classList.toggle('fa-bars');
hamburger.querySelector('i').classList.toggle('fa-times');
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const icon = question.querySelector('i');
    // Check computed style for display, fallback to inline style
    const isOpen = window.getComputedStyle(answer).display === 'block' || answer.style.display === 'block';

    // Close all other FAQs
    faqQuestions.forEach(q => {
        const a = q.nextElementSibling;
        const i = q.querySelector('i');
        if (q !== question) {
            a.style.display = 'none';
            i.classList.remove('fa-chevron-up');
            i.classList.add('fa-chevron-down');
        }
    });

    // Toggle current FAQ
    answer.style.display = isOpen ? 'none' : 'block';
    icon.classList.toggle('fa-chevron-down', isOpen);
    icon.classList.toggle('fa-chevron-up', !isOpen);
});
});

// FAQ Category Filter
const categoryButtons = document.querySelectorAll('.faqs-categories button');
const faqItems = document.querySelectorAll('.faq-item');
categoryButtons.forEach(button => {
button.addEventListener('click', () => {
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.getAttribute('data-category');
    faqItems.forEach(item => {
        item.style.display = category === 'all' || item.getAttribute('data-category') === category ? 'block' : 'none';
    });
});
});

// FAQ Search
const searchInput = document.querySelector('.faqs-search input');
searchInput.addEventListener('input', () => {
const query = searchInput.value.toLowerCase().trim();
faqItems.forEach(item => {
    const question = item.querySelector('h3').textContent.toLowerCase();
    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
    item.style.display = question.includes(query) || answer.includes(query) ? 'block' : 'none';
});
categoryButtons.forEach(btn => btn.classList.remove('active'));
document.querySelector('.faqs-categories button[data-category="all"]').classList.add('active');
});

// Close mobile menu when clicking a nav link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.querySelector('i').classList.remove('fa-times');
    hamburger.querySelector('i').classList.add('fa-bars');
});
});
});
document.addEventListener('DOMContentLoaded', function() {
// FAQ Accordion Functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
const question = item.querySelector('.faq-question');

question.addEventListener('click', () => {
// Close all other items
faqItems.forEach(otherItem => {
if (otherItem !== item && otherItem.classList.contains('active')) {
  otherItem.classList.remove('active');
}
});

// Toggle current item
item.classList.toggle('active');
});
});

// Optional: Add FAQ search functionality
const faqSearch = document.querySelector('.faqs-search input');
if (faqSearch) {
faqSearch.addEventListener('input', function() {
const searchTerm = this.value.toLowerCase();
const faqQuestions = document.querySelectorAll('.faq-question h3');

faqQuestions.forEach(question => {
const item = question.closest('.faq-item');
const questionText = question.textContent.toLowerCase();

if (questionText.includes(searchTerm)) {
  item.style.display = 'block';
} else {
  item.style.display = 'none';
}
});
});
}
});


function searchCourses() {
  const query = document.getElementById('search').value.toLowerCase();
  const courses = document.querySelectorAll('.course-card');

  courses.forEach(course => {
    const title = course.querySelector('h3').textContent.toLowerCase();
    const category = course.querySelector('.category').textContent.toLowerCase();

    if (title.includes(query) || category.includes(query)) {
      course.style.display = 'block';
    } else {
      course.style.display = 'none';
    }
  });
}
// Enhanced JavaScript for interactive buttons
document.querySelectorAll('.path-button').forEach(button => {
  // Click event
  button.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.path-button').forEach(btn => {
          btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get which path was selected
      const selectedPath = this.dataset.path;
      console.log(`Selected path: ${selectedPath}`);
      
      // Here you would typically toggle between different content sections
      // For example:
      // document.querySelectorAll('.content-section').forEach(section => {
      //     section.style.display = 'none';
      // });
      // document.querySelector(`.${selectedPath}-content`).style.display = 'block';
  });
  
  // Mouse enter event for additional interactivity
  button.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
          this.style.transform = 'translateY(-3px)';
      }
  });
  
  // Mouse leave event
  button.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
          this.style.transform = '';
      }
  });
});
// Learning Path Button Navigation
document.querySelectorAll('.path-button').forEach(button => {
  button.addEventListener('click', () => {
      const path = button.getAttribute('data-path');
      let targetId;

      // Map data-path to section IDs
      if (path === 'grouped') {
          targetId = 'grouped-courses';
      } else if (path === 'individual') {
          targetId = 'courses';
      }

      // Scroll to the target section
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Toggle active state
      document.querySelectorAll('.path-button').forEach(btn => {
          btn.classList.remove('active');
      });
      button.classList.add('active');
  });
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
          // Scroll to the element with smooth behavior
          targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
          });
          
          // If clicking the Categories link, highlight the first button
          if (targetId === '#learning-path') {
              setTimeout(() => {
                  const buttons = document.querySelectorAll('.path-button');
                  buttons.forEach(btn => btn.classList.remove('active'));
                  buttons[0].classList.add('active');
              }, 500);
          }
      }
  });
});

// Existing button functionality
document.querySelectorAll('.path-button').forEach(button => {
  button.addEventListener('click', function() {
      document.querySelectorAll('.path-button').forEach(btn => {
          btn.classList.remove('active');
      });
      this.classList.add('active');
      
      const selectedPath = this.dataset.path;
      console.log(`Selected path: ${selectedPath}`);
      // Add your content switching logic here
  });
});


