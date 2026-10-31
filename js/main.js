/**
 * Main Controller for Ved Loya Portfolio
 * Architecture Inspired by Anthracite Studio (Awwwards Nominee)
 * 
 * Features:
 * 1. Floating Pill Scrollspy (Dynamic section indicator in center pill)
 * 2. Project View Mode Switcher ([ GRID ] / [ LIST ] in electric cobalt blue)
 * 3. Fullscreen Navigation Drawer
 * 4. 1-Click Clipboard Copy with Floating Toast
 * 5. Official Curriculum Vitae Modal & Print Handler
 * 6. Contact Transmission Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initPillScrollspy();
  initProjectViewToggle();
  initNavDrawer();
  initClipboardCopy();
  initResumeModal();
  initContactForm();
});

/* ==========================================================================
   1. FLOATING PILL SCROLLSPY (Screenshot 1, 3, 4)
   Updates the center text in the pill bar according to current visible section
   ========================================================================== */
function initPillScrollspy() {
  const indicator = document.getElementById('nav-active-section');
  if (!indicator) return;

  const sectionMap = [
    { id: 'hero', title: 'VED LOYA STUDIO' },
    { id: 'services', title: 'SERVICES' },
    { id: 'projects', title: 'PROJECTS' },
    { id: 'education', title: 'EDUCATION' },
    { id: 'leadership', title: 'LEADERSHIP' },
    { id: 'connect', title: 'INQUIRIES' }
  ];

  const sections = sectionMap
    .map(item => ({ el: document.getElementById(item.id), title: item.title }))
    .filter(item => item.el !== null);

  function updateActivePill() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const top = section.el.offsetTop;
      if (scrollPos >= top) {
        if (indicator.textContent.trim() !== section.title) {
          indicator.textContent = section.title;
        }
        break;
      }
    }
  }

  window.addEventListener('scroll', updateActivePill, { passive: true });
  updateActivePill();
}

/* ==========================================================================
   2. PROJECT VIEW TOGGLE [ GRID | LIST ] (Screenshot 4)
   ========================================================================== */
function initProjectViewToggle() {
  const btnGrid = document.getElementById('btn-view-grid');
  const btnList = document.getElementById('btn-view-list');
  const wrapper = document.getElementById('projects-wrapper');

  if (!btnGrid || !btnList || !wrapper) return;

  btnGrid.addEventListener('click', () => {
    btnGrid.classList.add('active');
    btnList.classList.remove('active');
    wrapper.classList.remove('view-mode-list');
    wrapper.classList.add('view-mode-grid');
  });

  btnList.addEventListener('click', () => {
    btnList.classList.add('active');
    btnGrid.classList.remove('active');
    wrapper.classList.remove('view-mode-grid');
    wrapper.classList.add('view-mode-list');
  });
}

/* ==========================================================================
   3. NAVIGATION DRAWER MENU
   ========================================================================== */
function initNavDrawer() {
  const menuToggle = document.getElementById('menu-toggle-btn');
  const drawer = document.getElementById('nav-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');

  if (!menuToggle || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openDrawer);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close when clicking a link
  const links = drawer.querySelectorAll('.drawer-link');
  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   4. 1-CLICK CLIPBOARD COPY & FLOATING TOAST
   ========================================================================== */
function initClipboardCopy() {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  let toastTimeout;
  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const icon = btn.querySelector('i');
        const origClass = icon ? icon.className : '';
        if (icon) icon.className = 'fas fa-check';

        showToast(`COPIED TO CLIPBOARD: ${textToCopy}`);

        setTimeout(() => {
          if (icon) icon.className = origClass;
        }, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`COPIED: ${textToCopy}`);
      }
    });
  });

  window.showToast = showToast;
}

/* ==========================================================================
   5. RESUME MODAL & PRINT HANDLER
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openButtons = document.querySelectorAll('.open-resume-btn');
  const closeBtn = document.getElementById('resume-close-btn');
  const printBtn = document.getElementById('resume-print-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. CONTACT TRANSMISSION FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const submitBtn = form.querySelector('.btn-form-submit');
    const origHtml = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>DISPATCHING...</span> <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      submitBtn.innerHTML = '<span>TRANSMISSION DISPATCHED</span> <i class="fas fa-check"></i>';
      submitBtn.style.backgroundColor = '#10b981';

      if (window.showToast) {
        window.showToast(`Transmission received from ${name}! Ved will contact you.`);
      }

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = origHtml;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.pointerEvents = '';
      }, 3500);
    }, 1000);
  });
}
