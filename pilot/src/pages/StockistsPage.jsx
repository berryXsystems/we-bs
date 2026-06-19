import { useState } from 'react'
import { STOCKISTS } from '../data'
import { Plus } from 'lucide-react'

export default function StockistsPage() {
  const [stockists, setStockists] = useState(STOCKISTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({})

  const save = () => {
    setStockists(prev => [...prev, { ...form, id: Date.now(), outstanding: 0, status: 'Active' }])
    setShowModal(false); setForm({})
  }

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Stockists / Distributors</div>
        <button className="btn btn-gold" onClick={() => setShowModal(true)}><Plus size={14}/> Add Stockist</button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[
          { label: 'Active Stockists', value: stockists.filter(s=>s.status==='Active').length },
          { label: 'Total Outstanding', value: `₹${stockists.reduce((a,s)=>a+s.outstanding,0).toLocaleString()}`, color: '#e06060' },
          { label: 'Total Credit Limit', value: `₹${stockists.reduce((a,s)=>a+s.credit,0).toLocaleString()}` },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card-value" style={c.color ? { color: c.color } : {}}>{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Stockist</th><th>Contact</th><th>City</th><th>Credit Limit</th><th>Outstanding</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stockists.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <div>{s.contact}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{s.phone}</div>
                  </td>
                  <td>{s.city}</td>
                  <td>₹{s.credit.toLocaleString()}</td>
                  <td style={{ color: s.outstanding > 0 ? '#e06060' : '#5dbd8e', fontWeight: 600 }}>
                    {s.outstanding > 0 ? `₹${s.outstanding.toLocaleString()}` : '—'}
                  </td>
                  <td><span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">Add Stockist</div>
            <div className="form-grid">
              {[['name','Firm Name'],['contact','Contact Person'],['phone','Phone'],['city','City'],['credit','Credit Limit (₹)']].map(([k,label]) => (
                <div className="form-group" key={k}>
                  <label className="input-label">{label}</label>
                  <input value={form[k]||''} onChange={e => setForm(p=>({...p,[k]:e.target.value}))} placeholder={label} />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={save}>Save Stockist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
