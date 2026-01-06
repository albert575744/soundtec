// ===== SOUNDTEC WEBSITE - MAIN JAVASCRIPT =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initNewsletterForm();
});

// ===== NAVBAR FUNCTIONALITY =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just #
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .project-card, .testimonial-card, .about-feature, .contact-detail'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (!validateContactForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sender...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification('Takk for din henvendelse! Vi kontakter deg snart.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);

        // In production, replace the setTimeout with actual form submission:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            showNotification('Takk for din henvendelse! Vi kontakter deg snart.', 'success');
            form.reset();
        })
        .catch(error => {
            showNotification('Noe gikk galt. Vennligst prøv igjen senere.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
        */
    });
}

// ===== VALIDATE CONTACT FORM =====
function validateContactForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+()-]+$/;

    if (!data.name || data.name.trim().length < 2) {
        showNotification('Vennligst oppgi et gyldig navn.', 'error');
        return false;
    }

    if (!data.email || !emailRegex.test(data.email)) {
        showNotification('Vennligst oppgi en gyldig e-postadresse.', 'error');
        return false;
    }

    if (data.phone && !phoneRegex.test(data.phone)) {
        showNotification('Vennligst oppgi et gyldig telefonnummer.', 'error');
        return false;
    }

    if (!data.subject) {
        showNotification('Vennligst velg et emne.', 'error');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showNotification('Vennligst skriv en melding på minst 10 tegn.', 'error');
        return false;
    }

    return true;
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const form = document.querySelector('.footer-newsletter');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const input = form.querySelector('.newsletter-input');
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            showNotification('Vennligst oppgi en gyldig e-postadresse.', 'error');
            return;
        }

        const btn = form.querySelector('.newsletter-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Sender...';
        btn.disabled = true;

        // Simulate subscription (replace with actual API call)
        setTimeout(() => {
            showNotification('Takk for at du abonnerer på vårt nyhetsbrev!', 'success');
            input.value = '';
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1000);

        // In production, replace with actual API call:
        /*
        fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(result => {
            showNotification('Takk for at du abonnerer på vårt nyhetsbrev!', 'success');
            input.value = '';
        })
        .catch(error => {
            showNotification('Noe gikk galt. Vennligst prøv igjen senere.', 'error');
        })
        .finally(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        });
        */
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
        font-size: 0.875rem;
    `;

    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== UTILITIES =====
// Get element's offset from top of page
function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== CONSOLE MESSAGE =====
console.log(
    '%cSoundtec Website',
    'font-size: 20px; font-weight: bold; color: #6366f1;'
);
console.log(
    '%cPowered by modern web technologies',
    'font-size: 12px; color: #64748b;'
);
