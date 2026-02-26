// Professional Beauty Salon Website JavaScript
// Consolidating logic and exposing functions for inline HTML handlers

// ==========================================
// 1. Global Variables & Configuration
// ==========================================
let currentSlideIndex = 0;
let slideInterval;
let serviceQuestions = {
    'Hair Styling': {
        title: 'Hair Service Details',
        questions: [
            { label: 'Hair Type', type: 'select', options: ['Straight', 'Wavy', 'Curly', 'Coily', 'Don\'t know'], required: true },
            { label: 'Hair Length', type: 'select', options: ['Short', 'Medium', 'Long', 'Extra Long'], required: true },
            { label: 'Service Type', type: 'select', options: ['Haircut & Styling', 'Hair Coloring', 'Hair Treatment', 'Bridal Hair'], required: true }
        ]
    },
    'Facial Treatments': {
        title: 'Skin Assessment',
        questions: [
            { label: 'Skin Type', type: 'select', options: ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'], required: true },
            { label: 'Main Skin Concern', type: 'select', options: ['Acne', 'Aging', 'Dryness', 'Pigmentation', 'General Maintenance'], required: true }
        ]
    },
    'Manicure & Pedicure': {
        title: 'Nail Service Details',
        questions: [
            { label: 'Service Type', type: 'select', options: ['Manicure', 'Pedicure', 'Both', 'Nail Art', 'Gel Extensions'], required: true },
            { label: 'Nail Condition', type: 'select', options: ['Healthy', 'Brittle', 'Weak', 'Damaged'], required: true }
        ]
    },
    'Makeup Artistry': {
        title: 'Makeup Service Details',
        questions: [
            { label: 'Occasion', type: 'select', options: ['Bridal', 'Party', 'Photoshoot', 'Editorial', 'Makeup Lesson'], required: true },
            { label: 'Skin Tone', type: 'select', options: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'], required: true }
        ]
    },
    'Waxing & Threading': {
        title: 'Hair Removal Details',
        questions: [
            { label: 'Service Type', type: 'select', options: ['Full Body Waxing', 'Eyebrow Threading', 'Brazilian Wax', 'Face Waxing'], required: true },
            { label: 'Skin Sensitivity', type: 'select', options: ['Normal', 'Sensitive', 'Very Sensitive'], required: true }
        ]
    },
    'Bridal Packages': {
        title: 'Bridal Service Details',
        questions: [
            { label: 'Wedding Date', type: 'date', required: true },
            { label: 'Package Type', type: 'select', options: ['Basic Bridal', 'Premium Bridal', 'Complete Bridal', 'Family Package'], required: true },
            { label: 'Number of People', type: 'number', min: 1, max: 10, required: true },
            { label: 'Trial Appointment Needed?', type: 'select', options: ['Yes', 'No'], required: true }
        ]
    }
};

// ==========================================
// 2. Global Functions (Exposed to Window)
// ==========================================

// Notification System
window.showNotification = function (message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    let iconHtml = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') iconHtml = '<i class="fas fa-check-circle"></i>';
    if (type === 'error') iconHtml = '<i class="fas fa-exclamation-circle"></i>';

    notification.innerHTML = `
        <div class="notification-icon">${iconHtml}</div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.closest('.notification').remove()">&times;</button>
    `;

    document.body.appendChild(notification);

    // Animate
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
};

// Testimonial Logic
window.showSlide = function (index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const container = document.querySelector('.testimonial-container');

    if (!slides.length) return;

    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    if (container) {
        container.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });
};

window.changeSlide = function (direction) {
    showSlide(currentSlideIndex + direction);
    resetAutoSlide();
};

window.currentSlide = function (index) {
    showSlide(index - 1); // index is 1-based from HTML
    resetAutoSlide();
};

function startAutoSlide() {
    slideInterval = setInterval(() => changeSlide(1), 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Modal Logic
window.openBookingModal = function (service, price) {
    const modal = document.getElementById('bookingModal');
    const serviceInput = document.getElementById('selectedService');
    const priceInput = document.getElementById('selectedPrice');
    const questionsDiv = document.getElementById('serviceQuestions');

    if (!modal) return;

    if (serviceInput) serviceInput.value = service;
    if (priceInput) priceInput.value = price;
    if (questionsDiv) questionsDiv.innerHTML = generateServiceQuestions(service);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeBookingModal = function () {
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('serviceBookingForm');
    const questionsDiv = document.getElementById('serviceQuestions');

    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (form) form.reset();
    if (questionsDiv) questionsDiv.innerHTML = '';
};

// Internal Helper
function generateServiceQuestions(serviceName) {
    const data = serviceQuestions[serviceName];
    if (!data) return '';

    let html = `<h4 style="color: #d4a574; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">${data.title}</h4>`;

    data.questions.forEach((q, i) => {
        const id = `q-${i}`;
        const req = q.required ? 'required' : '';
        const star = q.required ? '<span style="color:red">*</span>' : '';

        html += `<div class="form-group"><label for="${id}">${q.label}${star}</label>`;

        if (q.type === 'select') {
            html += `<select id="${id}" name="${q.label}" ${req}><option value="">Select...</option>`;
            q.options.forEach(opt => html += `<option value="${opt}">${opt}</option>`);
            html += `</select>`;
        } else if (q.type === 'date') {
            html += `<input type="date" id="${id}" name="${q.label}" ${req}>`;
        } else if (q.type === 'number') {
            html += `<input type="number" id="${id}" name="${q.label}" min="${q.min}" max="${q.max}" ${req}>`;
        } else {
            html += `<input type="text" id="${id}" name="${q.label}" ${req}>`;
        }
        html += `</div>`;
    });
    return html;
}

// ==========================================
// 3. Initialization & Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Sample Salon Scripts...');

    // Navbar Scroll (Removed Parallax, kept only Navbar style change)
    const navbar = document.querySelector('.navbar');
    /* 
    // Parallax removed to fix "disrupted" transition
    */
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Booking Buttons (Event Delegation + Direct Attachment)
    const bookBtns = document.querySelectorAll('.book-service-btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const service = btn.dataset.service;
            const price = btn.dataset.price;
            openBookingModal(service, price);
        });
    });

    // Modal Events
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const bookingModal = document.getElementById('bookingModal');

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeBookingModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeBookingModal);
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBookingModal();
        });
    }

    // Modal Form Submission
    const modalForm = document.getElementById('serviceBookingForm');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Booking...';
            submitBtn.disabled = true;

            // Simulate API
            setTimeout(() => {
                showNotification('Appointment Request Sent Successfully!', 'success');
                closeBookingModal();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Contact Section Form Submission ("Get in Touch")
    const contactForm = document.getElementById('bookingForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API
            setTimeout(() => {
                showNotification('Message Sent! We will contact you shortly.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const emailInput = newsletterForm.querySelector('input[type="email"]');

            if (!emailInput.value) return;

            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            // Simulate API
            setTimeout(() => {
                showNotification('Thanks for subscribing!', 'success');
                newsletterForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    // Initial Setup
    startAutoSlide();
});
