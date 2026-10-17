// 1. Mobile Menu Toggle
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close the mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// 2. Contact Form Validation
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent form submission to handle validation
  
  let isValid = true;

  // Clear previous errors
  nameError.textContent = '';
  emailError.textContent = '';
  messageError.textContent = '';
  formStatus.textContent = '';

  // Name check
  if (nameInput.value.trim() === '') {
    nameError.textContent = 'Please enter your name.';
    isValid = false;
  }

  // Email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address.';
    isValid = false;
  }

  // Message check
  if (messageInput.value.trim().length < 10) {
    messageError.textContent = 'Message must be at least 10 characters long.';
    isValid = false;
  }

 if (isValid) {
    formStatus.textContent = 'Sending message...';
    formStatus.style.color = '#2563EB';

    const formData = new FormData(contactForm);

    try {
      
      const response = await fetch('https://formspree.io/f/xrpereeg', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.style.color = 'green';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Oops! There was a problem submitting your form.';
        formStatus.style.color = 'red';
      }
    } catch (error) {
      formStatus.textContent = 'Error: Could not connect to mail service.';
      formStatus.style.color = 'red';
    }
  }
});