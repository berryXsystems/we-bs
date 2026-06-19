import { renderDashboard } from './js/views/dashboard.js'
import { renderInventory } from './js/views/inventory.js'
import { renderEmployees } from './js/views/employees.js'

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const viewContainer = document.getElementById('view-container');

  // Initial Render
  renderView('dashboard');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Get target view
      const target = item.getAttribute('data-target');
      renderView(target);
    });
  });

  function renderView(viewName) {
    viewContainer.innerHTML = ''; // Clear current
    
    // Add simple fade transition wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'fade-in';
    
    switch(viewName) {
      case 'dashboard':
        wrapper.innerHTML = renderDashboard();
        break;
      case 'inventory':
        wrapper.innerHTML = renderInventory();
        break;
      case 'employees':
        wrapper.innerHTML = renderEmployees();
        break;
      case 'reports':
        wrapper.innerHTML = `
          <div class="view-header">
            <h2 class="view-title">Reports & Analytics</h2>
            <p class="view-subtitle">Generate business insights.</p>
          </div>
          <div class="glass-card">
            <p>Reports module is currently under development.</p>
          </div>
        `;
        break;
      default:
        wrapper.innerHTML = '<h2>View not found</h2>';
    }
    
    viewContainer.appendChild(wrapper);
  }
});
