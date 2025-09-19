document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar a');
  const sections = document.querySelectorAll('section');

  // Resize navbar based on scroll position
  function resizeNav() {
    if (window.scrollY > 50) {
      navbar.classList.remove('large');
      navbar.classList.add('small');
    } else {
      navbar.classList.add('large');
      navbar.classList.remove('small');
    }
  }

  // Update active link based on scroll position
  function updateActive() {
    let index = sections.length - 1;
    const navHeight = navbar.offsetHeight;
    const fromTop = window.scrollY + navHeight + 10;

    sections.forEach((section, i) => {
      if (section.offsetTop <= fromTop) {
        index = i;
      }
    });

    // If scrolled to bottom of page, highlight last section
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
      index = sections.length - 1;
    }

    navLinks.forEach((link, i) => {
      if (i === index) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Enhanced parallax effect for better performance
  function updateParallax() {
    // Only apply parallax on desktop for performance
    if (window.innerWidth <= 768) return;
    
    const parallaxSections = document.querySelectorAll('.section.parallax');
    const scrollTop = window.pageYOffset;
    
    parallaxSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollTop + rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate if section is in viewport
      const isInViewport = (
        rect.top < windowHeight && 
        rect.bottom > 0
      );
      
      if (isInViewport) {
        // Calculate parallax offset based on scroll position
        // The multiplier (0.5) controls parallax speed - adjust as needed
        const parallaxSpeed = 0.5;
        const yPos = -(scrollTop - sectionTop) * parallaxSpeed;
        
        // Apply the parallax offset
        section.style.setProperty('--parallax-offset', `${yPos}px`);
      }
    });
  }

  // Smooth scrolling for nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Throttled scroll handler for better performance
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        resizeNav();
        updateActive();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Handle resize events
  window.addEventListener('resize', () => {
    updateParallax();
  }, { passive: true });

  // Initial state
  resizeNav();
  updateActive();
  updateParallax();

  // Carousel functionality
  const slidesContainer = document.querySelector('.carousel .slides');
  const slides = document.querySelectorAll('.carousel .slide');
  let currentSlide = 0;

  function showSlide(idx) {
    if (idx < 0) idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;
    slidesContainer.style.transform = `translateX(-${idx * 100}%)`;
    currentSlide = idx;
  }

  const nextBtn = document.querySelector('.carousel .next');
  const prevBtn = document.querySelector('.carousel .prev');

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
  }

  // Auto-advance carousel
  let carouselInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);

  // Pause auto-advance on hover
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(carouselInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000);
    });
  }

  // Fade-in sections using IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          // Don't unobserve immediately to allow for re-triggering if needed
        }
      });
    },
    { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    }
  );

  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
  });

  // Modal interactions for member cards
  const modal = document.querySelector('.modal');
  const modalTitle = modal.querySelector('h3');
  const modalBody = modal.querySelector('p');
  const closeBtn = modal.querySelector('.close');

  const memberInfo = {
    cosimo: {
      title: 'Cosimo de' Medici (Cosimo the Elder)',
      text: 'Cosimo de' Medici (1389–1464) founded the Medici political dynasty. As a banker and statesman, he effectively ruled Florence from 1434, patronizing artists like Brunelleschi and ensuring stability. His support of humanism and the arts transformed Florence into the cultural capital of the Renaissance.',
    },
    lorenzo: {
      title: 'Lorenzo de' Medici (Lorenzo the Magnificent)',
      text: 'Lorenzo de' Medici (1449–1492) was a poet, statesman and major patron. He fostered artists such as Botticelli, Leonardo da Vinci and Michelangelo, and kept Florence flourishing. Known as "the Magnificent," he balanced diplomacy with cultural patronage, creating a golden age of Renaissance art.',
    },
    catherine: {
      title: 'Catherine de' Medici',
      text: 'Catherine de' Medici (1519–1589) married Henry II of France. As queen consort and later regent, she wielded considerable power and saw three of her sons become kings of France. She played a crucial role in French politics during the tumultuous period of the French Wars of Religion.',
    },
  };

  document.querySelectorAll('.member-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.member;
      const info = memberInfo[key];
      if (info) {
        modalTitle.textContent = info.title;
        modalBody.textContent = info.text;
        modal.classList.add('active');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    // Re-enable body scroll
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Performance optimization: Reduce parallax calculations on lower-end devices
  const isLowEndDevice = () => {
    return navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  };

  // Disable parallax on low-end devices
  if (isLowEndDevice()) {
    const parallaxSections = document.querySelectorAll('.section.parallax');
    parallaxSections.forEach(section => {
      section.style.backgroundAttachment = 'scroll';
    });
  }
});

