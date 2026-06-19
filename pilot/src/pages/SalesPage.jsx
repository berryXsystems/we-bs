import { useState } from 'react'
import { SALES, EMPLOYEES, PRODUCTS, DOCTORS, STOCKISTS } from '../data'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'

const STATUS_BADGE = { Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-danger' }

export default function SalesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sales, setSales] = useState(SALES)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({})

  const filtered = sales.filter(s => {
    const ms = s.employee.toLowerCase().includes(search.toLowerCase()) ||
               s.product.toLowerCase().includes(search.toLowerCase()) ||
               s.doctor.toLowerCase().includes(search.toLowerCase())
    const mf = statusFilter === 'All' || s.status === statusFilter
    return ms && mf
  })

  const totalRevenue = filtered.reduce((acc, s) => acc + s.total, 0)

  const save = () => {
    const qty = Number(form.qty) || 0
    const rate = PRODUCTS.find(p => p.name === form.product)?.mrp || 0
    setSales(prev => [...prev, {
      ...form, id: Date.now(), qty, rate, total: qty * rate, status: 'Pending',
      date: new Date().toISOString().slice(0,10)
    }])
    setShowModal(false); setForm({})
  }

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Sales Records</div>
        <button className="btn btn-gold" onClick={() => setShowModal(true)}><Plus size={14}/> Add Sale</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Sales', value: sales.length },
          { label: 'Filtered Revenue', value: `₹${totalRevenue.toLocaleString()}` },
          { label: 'Pending', value: sales.filter(s => s.status === 'Pending').length },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card-value">{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1rem 1.4rem' }}>
        <div className="filters-row">
          <div className="search-bar">
            <Search size={14}/>
            <input placeholder="Search employee, product, doctor..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="tab-group">
            {['All','Paid','Pending','Overdue'].map(f => (
              <button key={f} className={`tab ${statusFilter===f?'active':''}`} onClick={() => setStatusFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Employee</th><th>Product</th><th>Doctor</th><th>Stockist</th><th>Qty</th><th>Rate</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--muted)' }}>{s.date}</td>
                  <td style={{ fontWeight: 500 }}>{s.employee}</td>
                  <td>{s.product}</td>
                  <td style={{ color: 'var(--muted)' }}>{s.doctor}</td>
                  <td style={{ color: 'var(--muted)' }}>{s.stockist}</td>
                  <td>{s.qty}</td>
                  <td>₹{s.rate}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{s.total?.toLocaleString()}</td>
                  <td><span className={`badge ${STATUS_BADGE[s.status]}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">Record New Sale</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">Employee</label>
                <select value={form.employee||''} onChange={e => setForm(p=>({...p,employee:e.target.value}))}>
                  <option value="">Select...</option>
                  {EMPLOYEES.map(e => <option key={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Product</label>
                <select value={form.product||''} onChange={e => setForm(p=>({...p,product:e.target.value}))}>
                  <option value="">Select...</option>
                  {PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Doctor</label>
                <select value={form.doctor||''} onChange={e => setForm(p=>({...p,doctor:e.target.value}))}>
                  <option value="">Select...</option>
                  {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Stockist</label>
                <select value={form.stockist||''} onChange={e => setForm(p=>({...p,stockist:e.target.value}))}>
                  <option value="">Select...</option>
                  {STOCKISTS.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Quantity</label>
                <input type="number" value={form.qty||''} onChange={e => setForm(p=>({...p,qty:e.target.value}))} placeholder="0" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={save}>Record Sale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
