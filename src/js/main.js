document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar a');
  const sections = document.querySelectorAll('section');

  // Resize navbar based on scroll position
  function resizeNav() {
    if (!navbar) return;
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
    if (!navbar || !sections.length || !navLinks.length) return;

    let index = sections.length - 1;
    const navHeight = navbar.offsetHeight || 0;
    const fromTop = window.scrollY + navHeight + 10;

    sections.forEach((section, i) => {
      if (section.offsetTop <= fromTop) index = i;
    });

    // If scrolled to bottom of page, highlight last section
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
      index = sections.length - 1;
    }

    navLinks.forEach((link, i) => {
      if (i === index) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  // Enhanced parallax scrolling effect
  function updateParallax() {
    const parallaxSections = document.querySelectorAll('.section.parallax');
    const windowHeight = window.innerHeight;

    parallaxSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Calculate if section is in viewport
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Calculate parallax offset based on scroll position
        const scrollProgress =
          (windowHeight - sectionTop) / (windowHeight + sectionHeight);
        const parallaxOffset = (scrollProgress - 0.5) * 100; // speed

        section.style.setProperty(
          '--parallax-y',
          `${50 + parallaxOffset * 0.5}%`
        );
      }
    });
  }
  // ====== 在你的 main.js 中【添加】以下代码 ======
function setupScrollImage(section) {
  const sticky = section.querySelector('.scroll-image__sticky');
  const img = sticky?.querySelector('img');
  if (!sticky || !img) return;

  function getDisplayedImgHeight() {
    // 图片以“宽度填满窗口”的比例缩放：显示高度 = naturalHeight * scale
    const scale = sticky.clientWidth / img.naturalWidth;
    return img.naturalHeight * scale;
  }

  function setSectionHeight() {
    const vh = window.innerHeight;
    const imgH = getDisplayedImgHeight();
    const extra = Math.max(0, imgH - vh);           // 需要额外滚动的像素
    section.style.height = (vh + extra) + 'px';     // 总高度 = 窗口高 + 额外
  }

  function updateImageOffset() {
    const vh = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const start = rect.top;
    const end = rect.bottom - vh;
    const total = Math.max(end - start, 1);
    const p = clamp((0 - start) / total, 0, 1);     // 0 → 1 的滚动进度
    const travel = Math.max(0, getDisplayedImgHeight() - vh);
    const y = -p * travel;                          // 向上移动
    img.style.transform = `translate3d(-50%, ${y}px, 0)`;
  }

  let ticking = false;
  function onScrollOrResize() {
    if (!ticking) {
      requestAnimationFrame(() => {
        setSectionHeight();
        updateImageOffset();
        ticking = false;
      });
      ticking = true;
    }
  }

  function init() {
    setSectionHeight();
    updateImageOffset();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
  }

  if (img.complete) init();
  else img.addEventListener('load', init, { once: true });
}

function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }


  // Smooth scrolling for nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const hash = this.getAttribute('href') || '';
      if (hash.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // 同步更新激活状态（延迟到滚动动画开始后）
          setTimeout(updateActive, 50);
        }
      }
    });
  });

  // Optimized scroll event listener
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
  window.addEventListener('resize', updateParallax, { passive: true });

  // Initial state
  resizeNav();
  updateActive();
  updateParallax();

  // Carousel functionality
  const slidesContainer = document.querySelector('.carousel .slides');
  const slides = document.querySelectorAll('.carousel .slide');
  let currentSlide = 0;

  function showSlide(idx) {
    if (!slidesContainer || !slides.length) return;
    if (idx < 0) idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;
    slidesContainer.style.transform = `translateX(-${idx * 100}%)`;
    currentSlide = idx;
  }

  const nextBtn = document.querySelector('.carousel .next');
  const prevBtn = document.querySelector('.carousel .prev');

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  }

  // 初始化轮播位置
  showSlide(0);

  // Fade-in sections using IntersectionObserver
  const ioTargets = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && ioTargets.length) {
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
    ioTargets.forEach((el) => observer.observe(el));
  } else {
    // 兼容不支持 IO 的浏览器
    ioTargets.forEach((el) => el.classList.add('show'));
  }

  // Modal interactions for member cards
  const modal = document.querySelector('.modal');

  // ✅ 修正：使用模板字符串，避免单引号导致的语法错误
  const memberInfo = {
    cosimo: {
      title: `Cosimo de' Medici (Cosimo the Elder)`,
      text: `Cosimo de' Medici (1389–1464) founded the Medici political dynasty. As a banker and statesman, he effectively ruled Florence from 1434, patronizing artists like Brunelleschi and ensuring stability.`,
    },
    lorenzo: {
      title: `Lorenzo de' Medici (Lorenzo the Magnificent)`,
      text: `Lorenzo de' Medici (1449–1492) was a poet, statesman and major patron. He fostered artists such as Botticelli, Leonardo da Vinci and Michelangelo, and kept Florence flourishing.`,
    },
    catherine: {
      title: `Catherine de' Medici`,
      text: `Catherine de' Medici (1519–1589) married Henry II of France. As queen consort and later regent, she wielded power and saw three of her sons become kings of France.`,
    },
  };

  if (modal) {
    const modalTitle = modal.querySelector('h3');
    const modalBody = modal.querySelector('p');
    const closeBtn = modal.querySelector('.close');

    document.querySelectorAll('.member-button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.member;
        const info = memberInfo[key];
        if (info && modalTitle && modalBody) {
          modalTitle.textContent = info.title;
          modalBody.textContent = info.text;
          modal.classList.add('active');
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
});


