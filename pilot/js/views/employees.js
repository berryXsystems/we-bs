export function renderEmployees() {
  return `
    <div class="view-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 class="view-title">Employee Hub</h2>
        <p class="view-subtitle">Track attendance, performance, and manage salaries.</p>
      </div>
      <div>
        <button class="primary-btn"><i class="fa-solid fa-user-plus"></i> Add Employee</button>
      </div>
    </div>

    <div class="grid-cards">
      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>Total Workforce</h3>
          <div class="value">45</div>
          <div class="trend positive">Active Staff</div>
        </div>
        <div class="stat-icon teal">
          <i class="fa-solid fa-users"></i>
        </div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>Today's Attendance</h3>
          <div class="value">98%</div>
          <div class="trend positive">44 Present, 1 Absent</div>
        </div>
        <div class="stat-icon green">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>Pending Payroll</h3>
          <div class="value">₹4,25,000</div>
          <div class="trend warning">Due in 5 days</div>
        </div>
        <div class="stat-icon orange">
          <i class="fa-solid fa-money-check-dollar"></i>
        </div>
      </div>
    </div>

    <div class="glass-card">
      <h3 style="margin-bottom: 1rem;">Employee Directory</h3>
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Performance Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random" style="width: 32px; border-radius: 50%;">
                  <strong>Sarah Jenkins</strong>
                </div>
              </td>
              <td>Senior Pharmacist</td>
              <td>Dispensary</td>
              <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <div style="width: 100px; height: 6px; background: var(--border-color); border-radius: 3px;">
                    <div style="width: 95%; height: 100%; background: var(--success-green); border-radius: 3px;"></div>
                  </div>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">95%</span>
                </div>
              </td>
              <td><span class="status-badge success">Active</span></td>
              <td><button class="icon-btn" style="width: 30px; height: 30px;"><i class="fa-solid fa-pen" style="font-size: 0.8rem;"></i></button></td>
            </tr>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=random" style="width: 32px; border-radius: 50%;">
                  <strong>Michael Chen</strong>
                </div>
              </td>
              <td>Inventory Manager</td>
              <td>Warehouse</td>
              <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <div style="width: 100px; height: 6px; background: var(--border-color); border-radius: 3px;">
                    <div style="width: 88%; height: 100%; background: var(--primary-blue); border-radius: 3px;"></div>
                  </div>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">88%</span>
                </div>
              </td>
              <td><span class="status-badge success">Active</span></td>
              <td><button class="icon-btn" style="width: 30px; height: 30px;"><i class="fa-solid fa-pen" style="font-size: 0.8rem;"></i></button></td>
            </tr>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="https://ui-avatars.com/api/?name=David+Ross&background=random" style="width: 32px; border-radius: 50%;">
                  <strong>David Ross</strong>
                </div>
              </td>
              <td>Sales Representative</td>
              <td>Field Sales</td>
              <td>
                <div style="display: flex; align-items: center; gap: 5px;">
                  <div style="width: 100px; height: 6px; background: var(--border-color); border-radius: 3px;">
                    <div style="width: 72%; height: 100%; background: var(--warning-orange); border-radius: 3px;"></div>
                  </div>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">72%</span>
                </div>
              </td>
              <td><span class="status-badge warning">On Leave</span></td>
              <td><button class="icon-btn" style="width: 30px; height: 30px;"><i class="fa-solid fa-pen" style="font-size: 0.8rem;"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
