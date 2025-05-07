
// DOM Elements
const DOM = {
  cartCount: document.getElementById('cartCount'),
  cartLink: document.getElementById('cartLink'),
  wishlistCount: document.getElementById('wishlistCount'),
  wishlistLink: document.getElementById('wishlistLink'),
  checkoutModal: document.getElementById('checkoutModal'),
  cartItems: document.getElementById('cartItems'),
  totalPrice: document.getElementById('totalPrice'),
  paymentForm: document.getElementById('paymentForm'),
  searchInput: document.getElementById('searchInput'),
  searchSuggestions: document.getElementById('searchSuggestions'),
  courseGrid: document.getElementById('courseGrid'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortFilter: document.getElementById('sortFilter'),
  prevPage: document.getElementById('prevPage'),
  nextPage: document.getElementById('nextPage'),
  pageInfo: document.getElementById('pageInfo'),
  carousel: document.getElementById('carousel')
};

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentPage = 1;
const coursesPerPage = 6;
let carouselIndex = 0;

// Sample Courses Data (Tailored to Requested Subjects)
const courses = [
  { id: 1, title: "Calculus for Beginners", category: "Maths", instructor: "Dr. Emma Wilson", rating: 4.7, reviews: 1500, price: 49.99, image: "https://via.placeholder.com/300x150?text=Calculus" },
  { id: 2, title: "Linear Algebra Essentials", category: "Maths", instructor: "Prof. James Lee", rating: 4.5, reviews: 1200, price: 59.99, image: "https://via.placeholder.com/300x150?text=Linear+Algebra" },
  { id: 3, title: "English Writing Mastery", category: "English", instructor: "Sarah Davis", rating: 4.6, reviews: 1800, price: 39.99, image: "https://via.placeholder.com/300x150?text=English+Writing" },
  { id: 4, title: "Advanced English Grammar", category: "English", instructor: "Laura Martinez", rating: 4.4, reviews: 900, price: 44.99, image: "https://via.placeholder.com/300x150?text=English+Grammar" },
  { id: 5, title: "Introduction to Social Anthropology", category: "Anthropology", instructor: "Dr. Alex Brown", rating: 4.8, reviews: 1100, price: 54.99, image: "https://via.placeholder.com/300x150?text=Anthropology" },
  { id: 6, title: "Cultural Anthropology", category: "Anthropology", instructor: "Prof. Maria Gonzalez", rating: 4.6, reviews: 850, price: 64.99, image: "https://via.placeholder.com/300x150?text=Cultural+Anthropology" },
  { id: 7, title: "Psychology of Behavior", category: "Psychology", instructor: "Dr. John Smith", rating: 4.9, reviews: 2000, price: 69.99, image: "https://via.placeholder.com/300x150?text=Psychology" },
  { id: 8, title: "Cognitive Psychology", category: "Psychology", instructor: "Dr. Emily Chen", rating: 4.7, reviews: 1400, price: 59.99, image: "https://via.placeholder.com/300x150?text=Cognitive+Psychology" },
  { id: 9, title: "Fundamentals of Physics", category: "Physics", instructor: "Prof. David Kim", rating: 4.5, reviews: 1300, price: 49.99, image: "https://via.placeholder.com/300x150?text=Physics" },
  { id: 10, title: "Quantum Mechanics Basics", category: "Physics", instructor: "Dr. Sophia Patel", rating: 4.8, reviews: 950, price: 79.99, image: "https://via.placeholder.com/300x150?text=Quantum+Mechanics" },
  { id: 11, title: "AI and Machine Learning", category: "Emerging Tech", instructor: "Michael Lee", rating: 4.9, reviews: 2500, price: 89.99, image: "https://via.placeholder.com/300x150?text=AI" },
  { id: 12, title: "Blockchain Technology", category: "Emerging Tech", instructor: "Dr. Rachel Adams", rating: 4.7, reviews: 1700, price: 74.99, image: "https://via.placeholder.com/300x150?text=Blockchain" }
];

// Save state to localStorage
function saveState() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update cart and wishlist counts
function updateCounts() {
  if (DOM.cartCount) DOM.cartCount.textContent = cart.length;
  if (DOM.wishlistCount) DOM.wishlistCount.textContent = wishlist.length;
  if (DOM.cartLink) DOM.cartLink.onclick = openCheckout;
  if (DOM.wishlistLink) DOM.wishlistLink.onclick = () => alert('Wishlist: ' + (wishlist.length ? wishlist.map(c => c.title).join(', ') : 'Empty'));
}

// Add to cart
function addToCart(course) {
  if (!cart.some(c => c.id === course.id)) {
    cart.push(course);
    saveState();
    updateCounts();
  }
}

// Remove from cart
function removeFromCart(courseId) {
  cart = cart.filter(c => c.id !== courseId);
  saveState();
  updateCounts();
  if (DOM.checkoutModal.style.display === 'flex') openCheckout();
}

// Toggle wishlist
function toggleWishlist(course, button) {
  const index = wishlist.findIndex(c => c.id === course.id);
  if (index === -1) {
    wishlist.push(course);
    button.classList.add('active');
  } else {
    wishlist.splice(index, 1);
    button.classList.remove('active');
  }
  saveState();
  updateCounts();
}

// Render courses
function renderCourses(filteredCourses) {
  if (!DOM.courseGrid) return;
  DOM.courseGrid.innerHTML = '';
  const start = (currentPage - 1) * coursesPerPage;
  const end = start + coursesPerPage;
  const paginatedCourses = filteredCourses.slice(start, end);

  paginatedCourses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.setAttribute('data-title', course.title);
    card.innerHTML = `
      <img src="${course.image}" alt="${course.title}">
      <h3>${course.title}</h3>
      <p class="instructor">by ${course.instructor}</p>
      <p class="rating">★${course.rating} (${course.reviews} reviews)</p>
      <p class="price">$${course.price.toFixed(2)}</p>
      <div class="actions">
        <button class="cart-btn" onclick="addToCart(${JSON.stringify(course).replace(/"/g, '"')})">Add to Cart</button>
        <button class="wishlist-btn ${wishlist.some(c => c.id === course.id) ? 'active' : ''}" onclick="toggleWishlist(${JSON.stringify(course).replace(/"/g, '"')}, this)">★ Wishlist</button>
      </div>
    `;
    DOM.courseGrid.appendChild(card);
  });

  updatePagination(filteredCourses.length);
}

// Update pagination
function updatePagination(totalCourses) {
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  if (DOM.pageInfo) DOM.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  if (DOM.prevPage) DOM.prevPage.disabled = currentPage === 1;
  if (DOM.nextPage) DOM.nextPage.disabled = currentPage === totalPages;
}

// Change page
function changePage(delta) {
  currentPage += delta;
  applyFilters();
}

// Apply filters and sorting
function applyFilters() {
  const category = DOM.categoryFilter?.value || 'all';
  const sort = DOM.sortFilter?.value || 'default';
  let filteredCourses = courses;

  if (category !== 'all') {
    filteredCourses = courses.filter(c => c.category === category);
  }

  if (sort !== 'default') {
    filteredCourses = [...filteredCourses].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating-desc') return b.rating - a.rating;
      return 0;
    });
  }

  const query = DOM.searchInput?.value.toLowerCase() || '';
  if (query) {
    filteredCourses = filteredCourses.filter(c => c.title.toLowerCase().includes(query));
  }

  renderCourses(filteredCourses);
}

// Search courses with autocomplete
function searchCourses() {
  if (!DOM.searchInput || !DOM.searchSuggestions || !DOM.courseGrid) return;
  const query = DOM.searchInput.value.toLowerCase();
  const suggestions = courses.filter(c => c.title.toLowerCase().includes(query)).slice(0, 5);

  DOM.searchSuggestions.innerHTML = '';
  suggestions.forEach(course => {
    const li = document.createElement('li');
    li.textContent = course.title;
    li.onclick = () => {
      DOM.searchInput.value = course.title;
      DOM.searchSuggestions.innerHTML = '';
      applyFilters();
    };
    DOM.searchSuggestions.appendChild(li);
  });

  applyFilters();
}

// Debounce for search
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Open checkout modal
function openCheckout() {
  if (!DOM.checkoutModal || !DOM.cartItems || !DOM.totalPrice) return;
  if (cart.length === 0) {
    alert('Your cart is empty. Add some courses to proceed!');
    return;
  }

  DOM.cartItems.innerHTML = cart.map(c => `
    <div>
      <span>${c.title}</span>
      <span>$${c.price.toFixed(2)} <button onclick="removeFromCart(${c.id})">Remove</button></span>
    </div>
  `).join('');
  const totalPrice = cart.reduce((sum, c) => sum + c.price, 0).toFixed(2);
  DOM.totalPrice.textContent = `Total: $${totalPrice}`;
  DOM.checkoutModal.style.display = 'flex';
}

// Close checkout modal
function closeCheckout() {
  if (DOM.checkoutModal) DOM.checkoutModal.style.display = 'none';
}

// Validate payment form
function validatePaymentForm(inputs) {
  const cardNumber = inputs[0].value;
  const expiry = inputs[1].value;
  const cvc = inputs[2].value;

  const cardRegex = /^\d{16}$/;
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const cvcRegex = /^\d{3,4}$/;

  if (!cardRegex.test(cardNumber)) {
    alert('Please enter a valid 16-digit card number.');
    return false;
  }
  if (!expiryRegex.test(expiry)) {
    alert('Please enter a valid expiry date (MM/YY).');
    return false;
  }
  if (!cvcRegex.test(cvc)) {
    alert('Please enter a valid CVC (3-4 digits).');
    return false;
  }
  return true;
}

// Handle payment form submission
if (DOM.paymentForm) {
  DOM.paymentForm.addEventListener('submit', event => {
    event.preventDefault();
    const inputs = DOM.paymentForm.querySelectorAll('input');
    if (validatePaymentForm(inputs)) {
      alert('Payment processed successfully! (This is a mock payment.)');
      cart = [];
      saveState();
      updateCounts();
      closeCheckout();
    }
  });
}

// Toggle profile dropdown
function toggleProfileDropdown() {
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropdown) dropdown.classList.toggle('show');
}

// Carousel navigation
function changeCarousel(delta) {
  const items = DOM.carousel.querySelectorAll('.carousel-item');
  items[carouselIndex].classList.remove('active');
  carouselIndex = (carouselIndex + delta + items.length) % items.length;
  items[carouselIndex].classList.add('active');
}

// Event Listeners
if (DOM.searchInput) DOM.searchInput.addEventListener('input', debounce(searchCourses, 300));
window.addEventListener('click', event => {
  if (event.target === DOM.checkoutModal) closeCheckout();
  if (!event.target.closest('.profile-dropdown')) {
    const dropdown = document.querySelector('.dropdown-menu');
    if (dropdown) dropdown.classList.remove('show');
  }
});
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && DOM.checkoutModal.style.display === 'flex') closeCheckout();
});

// Initialize
updateCounts();
applyFilters();

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