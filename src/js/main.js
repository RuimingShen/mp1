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

  window.addEventListener('scroll', () => {
    resizeNav();
    updateActive();
  });

  // Initial state
  resizeNav();
  updateActive();
  (function() {
  const sections = Array.from(document.querySelectorAll('.section.parallax'));

  function update() {
    const vh = window.innerHeight;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const t = Math.min(1, Math.max(0, passed / total));
      const y = (t * 100).toFixed(2) + '%';
      sec.style.setProperty('--parallax-y', y);
    });
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  })();
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

  // Fade-in sections using IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
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
      title: 'Cosimo de’ Medici (Cosimo the Elder)',
      text:
        'Cosimo de’ Medici (1389–1464) founded the Medici political dynasty. As a banker and statesman, he effectively ruled Florence from 1434, patronizing artists like Brunelleschi and ensuring stability【802107299422787†L278-L291】.',
    },
    lorenzo: {
      title: 'Lorenzo de’ Medici (Lorenzo the Magnificent)',
      text:
        'Lorenzo de’ Medici (1449–1492) was a poet, statesman and major patron. He fostered artists such as Botticelli, Leonardo da Vinci and Michelangelo, and kept Florence flourishing【802107299422787†L300-L305】.',
    },
    catherine: {
      title: 'Catherine de’ Medici',
      text:
        'Catherine de’ Medici (1519–1589) married Henry II of France. As queen consort and later regent, she wielded power and saw three of her sons become kings of France【802107299422787†L318-L323】.',
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
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

