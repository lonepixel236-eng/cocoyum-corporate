/* ==========================================================================
   New Periyar Oil Mills - Interactivity Script (Refactored)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight Active Nav Link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.includes(href) && href !== 'index.html' && href !== './') {
            link.classList.add('active');
        } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && (href === 'index.html' || href === './')) {
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

    // 3. Product Filtering System (for products.html)
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
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transition = 'opacity 0.4s ease';
                        }, 50);
                    } else {
                        card.style.display = 'none';
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
    
    function handleFormSubmission(formElement, statusElement, prefixId = '') {
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Resolve element selectors based on form context
            const companyName = formElement.querySelector(prefixId ? `#company-name-${prefixId}` : '#company-name').value.trim();
            const contactName = formElement.querySelector(prefixId ? `#contact-name-${prefixId}` : '#contact-name').value.trim();
            const email = formElement.querySelector(prefixId ? `#email-${prefixId}` : '#email').value.trim();
            const volume = formElement.querySelector(prefixId ? `#volume-${prefixId}` : '#volume').value.trim();
            const product = formElement.querySelector(prefixId ? `#product-spec-${prefixId}` : '#product-spec').value;
            const destination = formElement.querySelector(prefixId ? `#destination-${prefixId}` : '#destination').value.trim();
            
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
        statusElement.className = 'form-status'; // Reset styling classes
        
        if (type === 'success') {
            statusElement.classList.add('success');
            statusElement.style.display = 'block';
            statusElement.style.backgroundColor = '#d1e7dd';
            statusElement.style.color = '#0f5132';
            statusElement.style.border = '1px solid #badbcc';
            statusElement.style.padding = '0.75rem';
            statusElement.style.marginTop = '0.5rem';
        } else if (type === 'error') {
            statusElement.classList.add('error');
            statusElement.style.display = 'block';
            statusElement.style.backgroundColor = '#f8d7da';
            statusElement.style.color = '#842029';
            statusElement.style.border = '1px solid #f5c2c7';
            statusElement.style.padding = '0.75rem';
            statusElement.style.marginTop = '0.5rem';
        } else {
            statusElement.style.display = 'block';
            statusElement.style.backgroundColor = '#cff4fc';
            statusElement.style.color = '#055160';
            statusElement.style.border = '1px solid #b6effb';
            statusElement.style.padding = '0.75rem';
            statusElement.style.marginTop = '0.5rem';
        }
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
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const threshold = 300;
            
            // Check if footer B2B form is in the viewport to avoid button overlap
            let footerVisible = false;
            if (footerB2B) {
                const rect = footerB2B.getBoundingClientRect();
                footerVisible = (rect.top < window.innerHeight && rect.bottom >= 0);
            }
            
            if (scrollPos > threshold && !footerVisible) {
                fobBtn.classList.add('visible');
            } else {
                fobBtn.classList.remove('visible');
            }
        });
        
        fobBtn.addEventListener('click', () => {
            if (footerB2B) {
                footerB2B.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
