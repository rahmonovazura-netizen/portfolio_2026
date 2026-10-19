/**
 * SPECIALIZED INTERACTIVE FEATURES
 * Live Search/Filter, Project Budget Estimator, Live Clock, Form Validator, Accordions, Copy Buttons
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initProjectsFilter();
  initBudgetEstimator();
  initContactForm();
  initFAQAccordions();
  initCopyButtons();
});

// 1. Live Local Clock (Tashkent UTC+5)
function initLiveClock() {
  const clockElement = document.getElementById('live-local-time');
  if (!clockElement) return;

  function update() {
    const options = {
      timeZone: 'Asia/Tashkent',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const now = new Intl.DateTimeFormat('uz-UZ', options).format(new Date());
    clockElement.textContent = now;
  }
  update();
  setInterval(update, 1000);
}

// 2. Projects Filter & Search
function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search-input');
  const projectCards = document.querySelectorAll('.project-item');
  const countDisplay = document.getElementById('visible-projects-count');

  if (!projectCards.length) return;

  let activeFilter = 'all';
  let searchTerm = '';

  function applyFilter() {
    let visibleCount = 0;
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.project-desc')?.textContent || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();

      const matchesFilter = activeFilter === 'all' || category.includes(activeFilter);
      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 30);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (card.style.opacity === '0') card.style.display = 'none';
        }, 300);
      }
    });

    if (countDisplay) {
      countDisplay.textContent = visibleCount;
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      if (window.AudioSynth) window.AudioSynth.playTone(550, 0.04, 'triangle');
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyFilter();
    });
  }
}

// 3. Interactive Budget & Timeline Estimator
function initBudgetEstimator() {
  const estimatorForm = document.getElementById('budget-estimator-form');
  if (!estimatorForm) return;

  const priceDisplay = document.getElementById('estimated-price-val');
  const daysDisplay = document.getElementById('estimated-days-val');

  function calculate() {
    let basePrice = 200;
    let baseDays = 5;

    // Checkboxes
    const checkedFeatures = estimatorForm.querySelectorAll('input[type="checkbox"]:checked');
    checkedFeatures.forEach(box => {
      basePrice += parseInt(box.dataset.price || '0', 10);
      baseDays += parseInt(box.dataset.days || '0', 10);
    });

    // Radio scope
    const checkedScope = estimatorForm.querySelector('input[name="project_scope"]:checked');
    if (checkedScope) {
      basePrice += parseInt(checkedScope.dataset.price || '0', 10);
      baseDays += parseInt(checkedScope.dataset.days || '0', 10);
    }

    if (priceDisplay) priceDisplay.textContent = `$${basePrice}`;
    if (daysDisplay) daysDisplay.textContent = `${baseDays} kun`;
  }

  estimatorForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      if (window.AudioSynth) window.AudioSynth.playTone(620, 0.05, 'sine');
      calculate();
    });
  });

  calculate();
}

// 4. Contact Form Validation & Animated Submission
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="client_name"]');
    const email = form.querySelector('[name="client_email"]');
    const message = form.querySelector('[name="client_message"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      if (window.showToast) window.showToast("⚠️ Iltimos, barcha majburiy maydonlarni to'ldiring!");
      if (window.AudioSynth) window.AudioSynth.playTone(300, 0.1, 'sawtooth');
      return;
    }

    // Button loading animation
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Yuborilmoqda...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<span>Yuborildi!</span>`;
      if (window.AudioSynth) window.AudioSynth.playTone(880, 0.12, 'sine');

      const modalSuccess = document.getElementById('success-modal');
      if (modalSuccess) {
        modalSuccess.classList.add('active');
      } else if (window.showToast) {
        window.showToast("🎉 Xabaringiz muvaffaqiyatli qabul qilindi!");
      }

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

// 5. FAQ Accordions
function initFAQAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const ans = other.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = `${ans.scrollHeight + 20}px`;
        if (window.AudioSynth) window.AudioSynth.playTone(500, 0.04, 'sine');
      }
    });
  });
}

// 6. Copy Buttons
function initCopyButtons() {
  document.querySelectorAll('[data-copy-text]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          if (window.showToast) window.showToast(`Nusxalandi: ${text}`);
          if (window.AudioSynth) window.AudioSynth.playTone(720, 0.05, 'triangle');
        });
      }
    });
  });
}
