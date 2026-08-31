/**
 * ==========================================================
 * ALI INTERNATIONAL TRAVELS & TOURS / ALI COMMUNICATION
 * Vanilla JavaScript Functionality
 * ==========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Active Page Navigation Indicator
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 4. Animated Statistics Counter
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const runCounters = () => {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 50; // animation speed

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count) + suffix;
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          runCounters();
          animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

  // 5. Scroll Reveal Animations using IntersectionObserver
  const revealElements = document.querySelectorAll('.service-card, .travel-card, .why-card, .about-grid > *, .featured-grid > *');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  // 6. Service Details Modal Functionality
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" id="modalClose">&times;</button>
      <div class="modal-icon" id="modalIcon">📄</div>
      <h3 class="modal-title" id="modalTitle">Service Title</h3>
      <p class="modal-desc" id="modalDesc">Service description goes here.</p>
      <div class="modal-requirements">
        <h4>Required Information / Documents:</h4>
        <ul id="modalReqList">
          <li>Valid identification / Passport copy</li>
          <li>Accurate applicant details</li>
        </ul>
      </div>
      <button class="btn btn-accent w-full" id="modalRequestBtn" style="width: 100%;">Request This Service Now</button>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalReqList = document.getElementById('modalReqList');
  const modalClose = document.getElementById('modalClose');
  const modalRequestBtn = document.getElementById('modalRequestBtn');

  // Service data database for modals
  const serviceDetails = {
    'passport': {
      title: 'Passport & National ID Forms',
      desc: 'Get fast, accurate online assistance for passport applications, renewals, and National ID documentation.',
      reqs: ['Original Citizenship Certificate', 'Old Passport (if renewal)', 'Active Phone Number & Email', 'Photograph as per government standard']
    },
    'police': {
      title: 'Police Report Assistance',
      desc: 'Seamless online police clearance report application support for travel, employment, and visa requirements.',
      reqs: ['Copy of Citizenship Certificate', 'Valid Passport copy', 'Reason for Police Report / Destination country', 'Current residential address details']
    },
    'visa': {
      title: 'Visa & Travel Support',
      desc: 'Comprehensive visa eligibility checking, guidance, and travel-related documentation assistance.',
      reqs: ['Valid Passport (minimum 6 months validity)', 'Passport size photographs', 'Travel itinerary / Purpose of visit', 'Financial supporting documents']
    },
    'ticket': {
      title: 'Flight Ticket Booking',
      desc: 'Domestic and international flight ticket booking, reservation reconfirmation, and date change assistance.',
      reqs: ['Passenger full name as in passport', 'Preferred travel dates & destination', 'Contact phone number', 'Passport copy for international flights']
    },
    'bill': {
      title: 'Utility Bill Payments',
      desc: 'Convenient digital payment assistance for electricity, telephone, internet, and television subscriptions.',
      reqs: ['Customer / Account ID number', 'Billing reference / Statement', 'Exact payment amount', 'Contact mobile number']
    },
    'license': {
      title: 'License Form Services',
      desc: 'Online driving license application form submission, appointment scheduling, and documentation support.',
      reqs: ['Citizenship Certificate', 'Medical certificate copy', 'Passport size photo', 'Email address and phone number']
    },
    'money': {
      title: 'Money Transfer Assistance',
      desc: 'Secure, reliable domestic and international money transfer services with instant assistance.',
      reqs: ['Valid government ID of sender & receiver', 'Bank account or collection details', 'Contact numbers', 'Transaction purpose']
    },
    'consultation': {
      title: 'Travel Consultation',
      desc: 'Professional, one-on-one support for travel planning, documentation preparation, and trip itineraries.',
      reqs: ['Destination preferences', 'Travel timeline', 'Specific documentation queries']
    }
  };

  // Open modal on "Learn More" clicks
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      const data = serviceDetails[serviceKey] || {
        title: 'Professional Service',
        desc: 'Ali International Travels & Tours provides professional assistance for your needs.',
        reqs: ['Valid identification documents', 'Contact information']
      };

      modalTitle.innerText = data.title;
      modalDesc.innerText = data.desc;
      modalReqList.innerHTML = data.reqs.map(r => `<li>${r}</li>`).join('');
      
      modalOverlay.classList.add('active');
    });
  });

  const closeModalFunc = () => {
    modalOverlay.classList.remove('active');
  };

  if (modalClose) modalClose.addEventListener('click', closeModalFunc);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModalFunc();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalFunc();
  });

  if (modalRequestBtn) {
    modalRequestBtn.addEventListener('click', () => {
      closeModalFunc();
      window.location.href = 'contact.html';
    });
  }

  // 7. Contact Form Validation & Success Toast
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !phone || !service) {
        showToast('Please fill in all required fields.', false);
        return;
      }

      // Show Success Toast
      showToast('Thank you! Your inquiry has been received.', true);
      contactForm.reset();
    });
  }

  // Toast notification helper
  function showToast(message, isSuccess = true) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${isSuccess ? 'toast-success' : ''}`;
    toast.innerHTML = `
      <span>${isSuccess ? '✅' : '⚠️'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // 8. Footer Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.innerText = new Date().getFullYear();
  }
});
