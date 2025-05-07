// Enhanced Smooth Scroll with Offset for Fixed Navbar
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// Advanced Ripple Effect with Customization
document.querySelectorAll('.group-item, .start-learning-btn, .about-course-card, .instructor-card').forEach(element => {
    element.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Custom ripple color based on element
        if (this.classList.contains('start-learning-btn')) {
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        } else if (this.classList.contains('group-item')) {
            ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        } else {
            ripple.style.background = 'rgba(0, 123, 255, 0.3)';
        }
        
        // Position and size the ripple
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = ripple.style.height = `${size}px`;
        
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Add ripple to element
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.style.opacity = '0';
            setTimeout(() => ripple.remove(), 300);
        }, 600);
    });
});

// Scroll Animation for Sections
function animateOnScroll() {
    const sections = document.querySelectorAll('.hero-section, .about-section, .instructor-section, .group-section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animation
window.addEventListener('load', () => {
    animateOnScroll();
    // Set initial state for animation
    document.querySelectorAll('.hero-section, .about-section, .instructor-section, .group-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

window.addEventListener('scroll', animateOnScroll);

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Card Tilt Effect
document.querySelectorAll('.about-course-card, .instructor-card, .group-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Tooltip Enhancement
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        // Delay tooltip appearance for better UX
        setTimeout(() => {
            this.setAttribute('data-tooltip-active', 'true');
        }, 300);
    });
    
    element.addEventListener('mouseleave', function() {
        this.removeAttribute('data-tooltip-active');
    });
});

// Dynamic Background Effect for Hero Section
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
}

// Interactive Counter for Stats (if you add stats section)
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Intersection Observer for Lazy Loading
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.lazy-load').forEach(element => {
    observer.observe(element);
});

// Dynamic Year for Footer (if you add footer)
const yearElement = document.getElementById('current-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Mobile Menu Toggle (if you add mobile menu)
const menuToggle = document.querySelector('.menu-toggle');
const navbarList = document.querySelector('.navbar ul');

if (menuToggle && navbarList) {
    menuToggle.addEventListener('click', () => {
        navbarList.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}