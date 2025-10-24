/**
 * Contact Form Handling
 * Handles form validation and submission for the contact form
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const formMessages = document.getElementById('form-messages');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    // Form validation
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input, select, textarea').forEach(el => {
            el.classList.remove('error');
        });

        // Validate name
        if (!name.value.trim()) {
            showError('name', 'Please enter your name');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('email', 'Please enter your email');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate subject
        if (!subject.value) {
            showError('subject', 'Please select a subject');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError('message', 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('message', 'Message should be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }


    // Show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Show form message
    function showMessage(type, message) {
        formMessages.textContent = message;
        formMessages.className = `form-messages ${type}`;
        formMessages.style.display = 'block';
        
        // Scroll to message
        formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessages.style.opacity = '0';
            setTimeout(() => {
                formMessages.style.display = 'none';
                formMessages.style.opacity = '1';
            }, 500);
        }, 5000);
    }

    // Toggle loading state
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            contactForm.classList.add('form-loading');
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
            contactForm.classList.remove('form-loading');
        }
    }

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                showMessage('success', 'Your message has been sent successfully! I\'ll get back to you soon.');
                // Reset form
                contactForm.reset();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('error', 'There was an error sending your message. Please try again later.');
        } finally {
            setLoading(false);
        }
    });

    // Real-time validation on blur
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Only validate if the field has been touched
            if (this.value.trim() !== '') {
                validateForm();
            }
        });
    });

    // Clear error on focus
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            const errorElement = document.getElementById(`${this.id}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
    });
});
