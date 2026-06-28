/**
 * LinguaPro - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavigation();
  initAnimations();
  initFormValidation();
  checkLoginStatus();
  initBackToTop();
});

/* --- Theme Management --- */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('linguapro-theme');
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('linguapro-theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  updateThemeIcons(document.documentElement.getAttribute('data-theme') || 'light');
}

function updateThemeIcons(theme) {
  const toggles = document.querySelectorAll('.theme-toggle i');
  toggles.forEach(icon => {
    if (theme === 'dark') {
      icon.classList.remove('ph-moon');
      icon.classList.add('ph-sun');
    } else {
      icon.classList.remove('ph-sun');
      icon.classList.add('ph-moon');
    }
  });
}

/* --- RTL Management --- */
function initRTL() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const savedRTL = localStorage.getItem('linguapro-rtl');
  
  if (savedRTL === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      document.documentElement.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
      localStorage.setItem('linguapro-rtl', !isRTL);
    });
  });
}

/* --- Navigation & Drawer --- */
function initNavigation() {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Drawer Toggle
  if (hamburger && drawer && overlay && closeBtn) {
    const openDrawer = () => {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }
}

/* --- Animations --- */
function initAnimations() {
  // Count-up for stats
  const counters = document.querySelectorAll('.stat-number');
  const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.getAttribute('data-target'), 10);
        let startValue = 0;
        const duration = 2000;
        const increment = endValue / (duration / 16);

        const updateCounter = () => {
          startValue += increment;
          if (startValue < endValue) {
            target.innerText = Math.ceil(startValue);
            requestAnimationFrame(updateCounter);
          } else {
            target.innerText = endValue;
          }
        };

        updateCounter();
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countUpObserver.observe(counter));

  // CEFR Rail Animation (Hero)
  const heroRail = document.querySelector('.hero-cefr-rail');
  if (heroRail) {
    const nodes = heroRail.querySelectorAll('.cefr-node');
    const connectors = heroRail.querySelectorAll('.cefr-connector');
    
    // reset
    nodes.forEach(n => { n.style.opacity = '0'; n.style.transform = 'scale(0.8)'; });
    connectors.forEach(c => { c.style.opacity = '0'; });

    const railObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let delay = 0;
          nodes.forEach((node, index) => {
            setTimeout(() => {
              node.style.animation = 'nodePop 0.4s ease forwards';
              if (index > 0) {
                connectors[index - 1].style.transition = 'opacity 0.4s ease';
                connectors[index - 1].style.opacity = '1';
              }
            }, delay);
            delay += 120; // 120ms stagger
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    railObserver.observe(heroRail);
  }
}

/* --- Form Validation --- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      
      inputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector('.error-message');
        
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('form-error');
          if (errorMsg) errorMsg.style.display = 'block';
        } else if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            isValid = false;
            input.classList.add('form-error');
            if (errorMsg) {
              errorMsg.innerText = 'Please enter a valid email';
              errorMsg.style.display = 'block';
            }
          } else {
            input.classList.remove('form-error');
            if (errorMsg) errorMsg.style.display = 'none';
          }
        } else if (input.type === 'checkbox') {
          if (!input.checked) {
            isValid = false;
            input.classList.add('form-error');
            if (errorMsg) errorMsg.style.display = 'block';
          } else {
             input.classList.remove('form-error');
             if (errorMsg) errorMsg.style.display = 'none';
          }
        } else {
          input.classList.remove('form-error');
          if (errorMsg) errorMsg.style.display = 'none';
        }
        
        // Match password check
        if (input.name === 'confirm_password') {
          const pwd = form.querySelector('input[name="password"]');
          if (pwd && pwd.value !== input.value) {
            isValid = false;
            input.classList.add('form-error');
            if (errorMsg) {
              errorMsg.innerText = 'Passwords do not match';
              errorMsg.style.display = 'block';
            }
          }
        }
      });

      if (isValid) {
        // Show success inline
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check"></i> Success';
        btn.style.backgroundColor = 'var(--color-accent)';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          form.reset();
        }, 3000);
      }
    });

    // Clear error on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('form-error');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.style.display = 'none';
      });
    });
  });
}

/* --- Login Simulation --- */
// Utility to toggle logged-in state for testing dashboard links
function checkLoginStatus() {
  if (localStorage.getItem('linguapro-logged-in') === 'true') {
    document.body.classList.add('user-logged-in');
  }
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="ph ph-arrow-up"></i>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
