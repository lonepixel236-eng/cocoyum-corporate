/* ==========================================================================
   Cocoyum - Interactivity Script (Refactored)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight Active Nav Link (Robust Path Matching)
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.substring(href.lastIndexOf('/') + 1);
        
        if (pageName === linkPage) {
            link.classList.add('active');
        } else if ((pageName === '' || pageName === 'index.html') && (linkPage === 'index.html' || linkPage === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }

    // 3. Product Filtering System with Micro-Animations (for products.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-grid .product-card');
    
    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                productCards.forEach(card => {
                    const type = card.getAttribute('data-type');
                    if (filterValue === 'all' || type === filterValue) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            card.style.transition = 'opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // 4. Helper validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function handleFormSubmission(formElement, statusElement) {
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Resolve element selectors supporting both standard and footer-prefixed IDs
            const companyName = formElement.querySelector('#company-name, #footer-company-name').value.trim();
            const contactName = formElement.querySelector('#contact-name, #footer-contact-name').value.trim();
            const email = formElement.querySelector('#email, #footer-email').value.trim();
            const volume = formElement.querySelector('#volume, #footer-volume').value.trim();
            const product = formElement.querySelector('#product-spec, #footer-product-spec').value;
            const destination = formElement.querySelector('#destination, #footer-destination').value.trim();
            
            if (!companyName || !contactName || !email || !volume || !product || !destination) {
                showFormStatus(statusElement, 'Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showFormStatus(statusElement, 'Please enter a valid business email address.', 'error');
                return;
            }
            
            showFormStatus(statusElement, 'Submitting your enterprise inquiry...', 'info');
            
            setTimeout(() => {
                showFormStatus(statusElement, 'Thank you! Your inquiry has been logged successfully. A B2B trade representative will contact you within 24 hours.', 'success');
                formElement.reset();
            }, 1500);
        });
    }
    
    function showFormStatus(statusElement, message, type) {
        statusElement.textContent = message;
        statusElement.className = 'form-status ' + type;
    }

    // Initialize Footer form
    const footerForm = document.querySelector('#footer-b2b-wrapper #b2b-inquiry-form');
    const footerStatus = document.querySelector('#footer-b2b-wrapper #form-status-message');
    if (footerForm && footerStatus) {
        handleFormSubmission(footerForm, footerStatus);
    }

    // Initialize Main Page form (on b2b.html)
    const mainForm = document.querySelector('#trade-inquiry-section #b2b-inquiry-form-main');
    const mainStatus = document.querySelector('#trade-inquiry-section #form-status-message-main');
    if (mainForm && mainStatus) {
        handleFormSubmission(mainForm, mainStatus);
    }

    // 5. Floating Action Button (FOB/FAB) Scroll Tracker
    const fobBtn = document.getElementById('fob-contact-btn');
    const footerB2B = document.getElementById('footer-b2b-wrapper');
    
    if (fobBtn) {
        // Trigger check on load in case the user starts partially scrolled
        checkFobVisibility();
        
        window.addEventListener('scroll', checkFobVisibility);
        
        function checkFobVisibility() {
            const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            const threshold = 150; // Show sooner as the user scrolls
            
            // Check if footer B2B form is in the viewport (with a 150px buffer so it doesn't hide too early)
            let footerVisible = false;
            if (footerB2B) {
                const rect = footerB2B.getBoundingClientRect();
                footerVisible = (rect.top < (window.innerHeight - 150) && rect.bottom >= 0);
            }
            
            if (scrollPos > threshold && !footerVisible) {
                fobBtn.classList.add('visible');
            } else {
                fobBtn.classList.remove('visible');
            }
        }
        
        fobBtn.addEventListener('click', () => {
            if (footerB2B) {
                footerB2B.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
