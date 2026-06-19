import { BATCHES } from '../data'

export default function BatchesPage() {
  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Batch Management</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Batches', value: BATCHES.length },
          { label: 'Near Expiry', value: BATCHES.filter(b=>b.status==='Near Expiry').length, color: '#e06060' },
          { label: 'Active Batches', value: BATCHES.filter(b=>b.status==='Active').length, color: '#5dbd8e' },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card-value" style={c.color?{color:c.color}:{}}>{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Batch Records</div></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Batch No.</th><th>Mfg Date</th><th>Expiry</th><th>Total Qty</th><th>Available</th><th>Status</th></tr>
            </thead>
            <tbody>
              {BATCHES.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.product}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--muted)' }}>{b.batch}</td>
                  <td style={{ color: 'var(--muted)' }}>{b.mfg}</td>
                  <td style={{ color: b.status === 'Near Expiry' ? '#e06060' : 'var(--muted)' }}>{b.expiry}</td>
                  <td>{b.qty.toLocaleString()}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{b.available.toLocaleString()}</td>
                  <td><span className={`badge ${b.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
