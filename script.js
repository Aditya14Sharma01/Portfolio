function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function toggleMenu() {
    navLinks.classList.toggle('active');
    navBackdrop.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  if (menuToggle && navLinks && navBackdrop) {
    menuToggle.addEventListener('click', toggleMenu);
    navBackdrop.addEventListener('click', toggleMenu);
  }

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Smooth scrolling with offset for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// 3D Robot Welcome Animation
// (Removed as per user request)

// Remove theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');

    if (menuToggle && navLinks && navBackdrop) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navBackdrop.classList.toggle('active');
        });

        navBackdrop.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navBackdrop.classList.remove('active');
        });
    }
});

function sendEmail(event) {
  event.preventDefault(); // Prevent the default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;

  // Basic validation
  if (!name || !email || !phone || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // Send email using EmailJS
  emailjs.send('service_k6cc7gp', 'template_ekpsph9', {
    from_name: name,
    from_email: email,
    phone: phone,
    message: message,
  })
  .then(function(response) {
    console.log('SUCCESS!', response.status, response.text);
    alert('Thank you for your message! We will get back to you soon.');
  }, function(error) {
    console.log('FAILED...', error);
    alert('Failed to send the message. Please try again later.');
  });
}
