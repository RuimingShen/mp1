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
  function updateActive() {
  const navHeight = navbar.offsetHeight;
  const probe = navHeight + 10;

  let index = 0;

  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= probe && rect.bottom > probe) {
      index = i;
    }
  });

  const doc = document.documentElement;
  if (Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 1) {
    index = sections.length - 1;
  }

  navLinks.forEach((link, i) => {
    link.classList.toggle('active', i === index);
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


