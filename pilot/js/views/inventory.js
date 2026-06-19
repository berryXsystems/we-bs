export function renderInventory() {
  return `
    <div class="view-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 class="view-title">Inventory Management</h2>
        <p class="view-subtitle">Manage pharma stock, batches, and expiries.</p>
      </div>
      <div>
        <button class="primary-btn"><i class="fa-solid fa-plus"></i> Add Stock</button>
      </div>
    </div>

    <div class="glass-card">
      <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
        <div class="search-bar" style="width: 300px; background: rgba(255,255,255,0.5);">
          <i class="fa-solid fa-filter"></i>
          <input type="text" placeholder="Filter by product name or batch...">
        </div>
        <div>
          <button class="icon-btn" style="display: inline-flex;"><i class="fa-solid fa-download"></i></button>
        </div>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Batch No.</th>
              <th>Stock Level</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Atorvastatin 40mg</strong></td>
              <td>Cardiovascular</td>
              <td>AT-4592</td>
              <td>1,240 Units</td>
              <td>2028-05-12</td>
              <td><span class="status-badge success">Optimal</span></td>
              <td><i class="fa-solid fa-ellipsis-vertical" style="cursor:pointer; color: var(--text-muted);"></i></td>
            </tr>
            <tr>
              <td><strong>Metformin 500mg</strong></td>
              <td>Antidiabetic</td>
              <td>MT-1102</td>
              <td>850 Units</td>
              <td>2027-11-20</td>
              <td><span class="status-badge success">Optimal</span></td>
              <td><i class="fa-solid fa-ellipsis-vertical" style="cursor:pointer; color: var(--text-muted);"></i></td>
            </tr>
            <tr>
              <td><strong>Amoxicillin 500mg</strong></td>
              <td>Antibiotic</td>
              <td>B-7842</td>
              <td>120 Units</td>
              <td>2026-06-25</td>
              <td><span class="status-badge danger">Expiring Soon</span></td>
              <td><i class="fa-solid fa-ellipsis-vertical" style="cursor:pointer; color: var(--text-muted);"></i></td>
            </tr>
            <tr>
              <td><strong>Ibuprofen 400mg</strong></td>
              <td>Analgesic</td>
              <td>IB-3321</td>
              <td>45 Units</td>
              <td>2029-01-15</td>
              <td><span class="status-badge warning">Low Stock</span></td>
              <td><i class="fa-solid fa-ellipsis-vertical" style="cursor:pointer; color: var(--text-muted);"></i></td>
            </tr>
            <tr>
              <td><strong>Omeprazole 20mg</strong></td>
              <td>Gastrointestinal</td>
              <td>O-1123</td>
              <td>300 Units</td>
              <td>2026-07-02</td>
              <td><span class="status-badge warning">Expiring Soon</span></td>
              <td><i class="fa-solid fa-ellipsis-vertical" style="cursor:pointer; color: var(--text-muted);"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
