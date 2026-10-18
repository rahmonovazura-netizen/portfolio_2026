/* ========================================================
   PORTFOLIO MAIN APPLICATION LOGIC (APP.JS)
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Theme Switcher (Dark / Light Rejim) + Fon Animatsiyasi
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Saqlangan mavzuni olish
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // To'lqin (ripple) animatsiyasini chaqirish
      if (window.PortfolioAnimations) {
        PortfolioAnimations.triggerBgRipple(e, newTheme === 'light' ? '#f8fafc' : '#0b0f19');
      }

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // 2. Dynamic Color Palette Switcher (Rang Sxemasi) + Animatsiya
  const paletteToggle = document.getElementById('palette-toggle');
  const paletteDropdown = document.getElementById('palette-dropdown');
  const paletteDots = document.querySelectorAll('.palette-dot');

  if (paletteToggle && paletteDropdown) {
    paletteToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      paletteDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      paletteDropdown.classList.remove('active');
    });

    paletteDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const color = dot.getAttribute('data-color');
        
        // Tanlangan nuqtani faollashtirish
        paletteDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        // To'lqin effekti bilan fon rangini uyg'unlashtirish
        if (window.PortfolioAnimations) {
          PortfolioAnimations.triggerBgRipple(e, color);
        }

        // CSS Variables yangilash
        document.documentElement.style.setProperty('--primary', color);
        document.documentElement.style.setProperty('--primary-glow', `${color}66`);
        
        // Hex to RGB
        const rgb = hexToRgb(color);
        if (rgb) {
          document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }

        localStorage.setItem('portfolio-primary-color', color);
      });
    });

    // Saqlangan rangni yuklash
    const savedColor = localStorage.getItem('portfolio-primary-color');
    if (savedColor) {
      const activeDot = document.querySelector(`.palette-dot[data-color="${savedColor}"]`);
      if (activeDot) {
        paletteDots.forEach(d => d.classList.remove('active'));
        activeDot.classList.add('active');
      }
      document.documentElement.style.setProperty('--primary', savedColor);
      document.documentElement.style.setProperty('--primary-glow', `${savedColor}66`);
      const rgb = hexToRgb(savedColor);
      if (rgb) {
        document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    }
  }

  // Hex to RGB helper
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // 3. Navbar Scrolled Effekti & Active Link
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header shadow
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Mobil Menyu (Hamburger)
  const menuBurger = document.getElementById('menu-burger');
  const navMenu = document.getElementById('nav-menu');

  if (menuBurger && navMenu) {
    menuBurger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 5. Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Contact Form Submission (Interaktiv xabarnoma)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yuborilmoqda...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Xabar Yuborildi!';
        submitBtn.style.background = '#10b981';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 1200);
    });
  }
});
