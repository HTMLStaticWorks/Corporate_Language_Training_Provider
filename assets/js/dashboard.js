/**
 * LinguaPro - Dashboard Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardViews();
  initDashboardSidebar();
  initChartSimulation();
  initModals();
  initReportSimulation();
  initTableFilters();
});

// Switch between dashboard views
function initDashboardViews() {
  const links = document.querySelectorAll('.sidebar-menu a:not(.logout-link)');
  const views = document.querySelectorAll('.dashboard-view');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active link
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Show corresponding view
      const targetId = link.getAttribute('href').substring(1); // remove #
      views.forEach(view => {
        if (view.id === targetId) {
          view.style.display = 'block';
          // Trigger reflow/animation if needed
          view.classList.add('animate-fade-up');
        } else {
          view.style.display = 'none';
          view.classList.remove('animate-fade-up');
        }
      });
      
      // Close sidebar on mobile after click
      if (window.innerWidth <= 1024) {
        document.querySelector('.sidebar').classList.remove('open');
      }
    });
  });
}

// Sidebar toggle for mobile
function initDashboardSidebar() {
  const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const closeBtn = document.querySelector('.sidebar-close');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    }
  }
}

// Simple CSS/JS Chart Simulation
function initChartSimulation() {
  const bars = document.querySelectorAll('.chart-bar-fill');
  // Animate on load
  setTimeout(() => {
    bars.forEach(bar => {
      const targetHeight = bar.parentElement.getAttribute('data-value') + '%';
      bar.style.height = targetHeight;
    });
  }, 300);
}

// Modal logic
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.modal-close');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('open');
      }
    });
  });
  
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.remove('open');
    });
  });
  
  // Close on outside click
  window.addEventListener('click', (e) => {
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
}

// Report Generation Simulation
function initReportSimulation() {
  const generateBtns = document.querySelectorAll('.generate-report-btn');
  
  generateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Generating...';
      btn.classList.add('disabled');
      
      setTimeout(() => {
        btn.innerHTML = '<i class="ph ph-check"></i> Download Ready';
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-primary', 'disabled');
          btn.classList.add('btn-outline');
        }, 3000);
      }, 2000);
    });
  });
}

// Simple Table Filter Simulation
function initTableFilters() {
  const filterSelect = document.getElementById('enrollment-filter');
  const tableRows = document.querySelectorAll('.enrollment-table tbody tr');
  
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      const val = e.target.value.toLowerCase();
      
      tableRows.forEach(row => {
        if (val === 'all') {
          row.style.display = '';
        } else {
          // just checking text content for simulation
          const text = row.innerText.toLowerCase();
          if (text.includes(val)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  }
}
