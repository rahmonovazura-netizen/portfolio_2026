/* ========================================================
   MODERN PORTFOLIO ANIMATIONS LOGIC (ANIMATIONS.JS)
   ======================================================== */

// Global animatsiyalar moduli
const PortfolioAnimations = (() => {

  // 1. Preloader & Sahifaga Kirish
  const initPreloader = () => {
    const preloader = document.getElementById('site-preloader');
    const bar = document.getElementById('preloader-bar');
    const percentText = document.getElementById('preloader-percent');
    
    if (!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        if (bar) bar.style.width = '100%';
        if (percentText) percentText.innerText = '100%';

        setTimeout(() => {
          preloader.classList.add('loaded');
          document.body.classList.add('page-loaded');
          animateCounters();
        }, 300);
      } else {
        if (bar) bar.style.width = `${progress}%`;
        if (percentText) percentText.innerText = `${progress}%`;
      }
    }, 45);
  };

  // 2. Sahifani qayta yuklash (Reload) animatsiyasi
  const triggerReloadAnimation = () => {
    const preloader = document.getElementById('site-preloader');
    if (!preloader) {
      location.reload();
      return;
    }

    // Preloader qayta tushishi
    preloader.classList.remove('loaded');
    preloader.classList.add('reloading');
    
    const bar = document.getElementById('preloader-bar');
    const percentText = document.getElementById('preloader-percent');
    if (bar) bar.style.width = '0%';
    if (percentText) percentText.innerText = '0%';

    setTimeout(() => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            preloader.classList.remove('reloading');
            preloader.classList.add('loaded');
          }, 300);
        }
        if (bar) bar.style.width = `${progress}%`;
        if (percentText) percentText.innerText = `${progress}%`;
      }, 35);
    }, 200);
  };

  // 3. Orqa fon rangi o'zgarganda to'lqin (Ripple) effekti
  const triggerBgRipple = (event, color = null) => {
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';

    const x = event && event.clientX ? event.clientX : window.innerWidth / 2;
    const y = event && event.clientY ? event.clientY : window.innerHeight / 2;

    const size = Math.max(window.innerWidth, window.innerHeight) * 2.6;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    const activeColor = color || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    ripple.style.background = activeColor;
    ripple.style.opacity = '0.35';

    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 850);
  };

  // 4. Scroll Progress Bar
  const initScrollProgress = () => {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
    });
  };

  // 5. Zamonaviy Neon Kursor
  const initCursor = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(render);
    };
    render();

    // Hover kattalashishi
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .tilt-card, .palette-dot');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
  };

  // 6. 3D Tilt Kartochkalar
  const initTiltCards = () => {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  };

  // 7. Scroll Reveal
  const initScrollReveal = () => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    elements.forEach((el) => observer.observe(el));
  };

  // 8. Raqamlar animatsiyasi (Statistika uchun)
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.innerText = target + (counter.parentElement.innerText.includes('%') ? '' : '+');
          clearInterval(timer);
        } else {
          counter.innerText = current;
        }
      }, 30);
    });
  };

  // 9. Yozuv Animatsiyasi (Typewriter Effect)
  const initTypewriter = () => {
    const textEl = document.getElementById('type-text');
    if (!textEl) return;

    const words = ['Frontend Dasturchi', 'UI/UX Dizayner', 'React & Next.js Mutaxassisi', 'Kreativ Web Muhandisi'];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const type = () => {
      const currentWord = words[wordIdx];
      if (isDeleting) {
        textEl.innerText = currentWord.substring(0, charIdx - 1);
        charIdx--;
      } else {
        textEl.innerText = currentWord.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 90;

      if (!isDeleting && charIdx === currentWord.length) {
        speed = 1800; // So'z to'liq yozilgach kutish
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 400;
      }

      setTimeout(type, speed);
    };

    type();
  };

  return {
    init: () => {
      initPreloader();
      initScrollProgress();
      initCursor();
      initTiltCards();
      initScrollReveal();
      initTypewriter();
    },
    triggerBgRipple,
    triggerReloadAnimation
  };
})();

// DOM yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
  PortfolioAnimations.init();

  // Reload demo tugmasi
  const reloadBtn = document.getElementById('btn-reload-demo');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      PortfolioAnimations.triggerReloadAnimation();
    });
  }
});
