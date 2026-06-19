export function renderDashboard() {
  return `
    <div class="view-header">
      <h2 class="view-title">Dashboard Overview</h2>
      <p class="view-subtitle">Real-time business insights and stock alerts.</p>
    </div>

    <div class="grid-cards">
      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>Total Revenue (MTD)</h3>
          <div class="value">₹12,45,000</div>
          <div class="trend positive"><i class="fa-solid fa-arrow-trend-up"></i> +12.5% vs last month</div>
        </div>
        <div class="stat-icon blue">
          <i class="fa-solid fa-dollar-sign"></i>
        </div>
      </div>

      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>Active Inventory</h3>
          <div class="value">4,208</div>
          <div class="trend positive"><i class="fa-solid fa-boxes-stacked"></i> Stock is healthy</div>
        </div>
        <div class="stat-icon green">
          <i class="fa-solid fa-pills"></i>
        </div>
      </div>

      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>Low Stock Alerts</h3>
          <div class="value" style="color: var(--danger-red);">12</div>
          <div class="trend negative"><i class="fa-solid fa-triangle-exclamation"></i> Requires attention</div>
        </div>
        <div class="stat-icon orange">
          <i class="fa-solid fa-bell"></i>
        </div>
      </div>
      
      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>Active Employees</h3>
          <div class="value">45</div>
          <div class="trend positive"><i class="fa-solid fa-user-check"></i> 98% Attendance Today</div>
        </div>
        <div class="stat-icon teal">
          <i class="fa-solid fa-users"></i>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="glass-card">
        <h3>Sales Performance</h3>
        <div style="height: 300px; display: flex; align-items: flex-end; gap: 15px; margin-top: 20px; padding-bottom: 25px;">
          <!-- Mock CSS Bar Chart -->
          <div style="flex: 1; height: 100%; background: var(--secondary-blue); border-radius: 8px 8px 0 0; position: relative;">
            <div style="height: 40%; background: var(--primary-blue); border-radius: 8px 8px 0 0; position: absolute; bottom: 0; width: 100%;"></div>
            <div style="position: absolute; bottom: -25px; width: 100%; text-align: center; font-size: 0.8rem; color: var(--text-muted);">Mon</div>
          </div>
          <div style="flex: 1; height: 100%; background: var(--secondary-blue); border-radius: 8px 8px 0 0; position: relative;">
            <div style="height: 60%; background: var(--primary-blue); border-radius: 8px 8px 0 0; position: absolute; bottom: 0; width: 100%;"></div>
            <div style="position: absolute; bottom: -25px; width: 100%; text-align: center; font-size: 0.8rem; color: var(--text-muted);">Tue</div>
          </div>
          <div style="flex: 1; height: 100%; background: var(--secondary-blue); border-radius: 8px 8px 0 0; position: relative;">
            <div style="height: 35%; background: var(--primary-blue); border-radius: 8px 8px 0 0; position: absolute; bottom: 0; width: 100%;"></div>
            <div style="position: absolute; bottom: -25px; width: 100%; text-align: center; font-size: 0.8rem; color: var(--text-muted);">Wed</div>
          </div>
          <div style="flex: 1; height: 100%; background: var(--secondary-blue); border-radius: 8px 8px 0 0; position: relative;">
            <div style="height: 80%; background: var(--primary-blue); border-radius: 8px 8px 0 0; position: absolute; bottom: 0; width: 100%;"></div>
            <div style="position: absolute; bottom: -25px; width: 100%; text-align: center; font-size: 0.8rem; color: var(--text-muted);">Thu</div>
          </div>
          <div style="flex: 1; height: 100%; background: var(--secondary-blue); border-radius: 8px 8px 0 0; position: relative;">
            <div style="height: 50%; background: var(--primary-blue); border-radius: 8px 8px 0 0; position: absolute; bottom: 0; width: 100%;"></div>
            <div style="position: absolute; bottom: -25px; width: 100%; text-align: center; font-size: 0.8rem; color: var(--text-muted);">Fri</div>
          </div>
          <div style="flex: 1; height: 100%; background: var(--secondary-blue); border-radius: 8px 8px 0 0; position: relative;">
            <div style="height: 90%; background: var(--primary-blue); border-radius: 8px 8px 0 0; position: absolute; bottom: 0; width: 100%;"></div>
            <div style="position: absolute; bottom: -25px; width: 100%; text-align: center; font-size: 0.8rem; color: var(--text-muted);">Sat</div>
          </div>
        </div>
      </div>
      
      <div class="glass-card">
        <h3>Critical Expirations</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">Stock expiring within 30 days</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 8px;">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">Amoxicillin 500mg</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Batch: B-7842</div>
            </div>
            <span class="status-badge danger">7 Days</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 8px;">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">Omeprazole 20mg</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Batch: O-1123</div>
            </div>
            <span class="status-badge warning">14 Days</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 8px;">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">Paracetamol 500mg</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Batch: P-9981</div>
            </div>
            <span class="status-badge warning">22 Days</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
