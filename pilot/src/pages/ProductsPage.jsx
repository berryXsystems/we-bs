import { useState } from 'react'
import { PRODUCTS } from '../data'
import { Search, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [products, setProducts] = useState(PRODUCTS)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))]

  const filtered = products.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.company.toLowerCase().includes(search.toLowerCase())
    const mc = category === 'All' || p.category === category
    return ms && mc
  })

  const openAdd  = () => { setEditing(null); setForm({}); setShowModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setShowModal(true) }
  const del      = (id) => setProducts(prev => prev.filter(p => p.id !== id))
  const save = () => {
    if (editing) setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p))
    else setProducts(prev => [...prev, { ...form, id: Date.now() }])
    setShowModal(false)
  }

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Products / Medicines</div>
        <button className="btn btn-gold" onClick={openAdd}><Plus size={14} /> Add Product</button>
      </div>

      <div className="card" style={{ padding: '1rem 1.4rem' }}>
        <div className="filters-row">
          <div className="search-bar">
            <Search size={14} />
            <input placeholder="Search product, company..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select style={{ width: 'auto', padding: '0.5rem 0.8rem' }} value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Company</th><th>MRP</th><th>Stock</th><th>Batch</th><th>Expiry</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const low = p.stock < p.minStock
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, color: 'var(--linen)' }}>{p.name}</td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td style={{ color: 'var(--muted)' }}>{p.company}</td>
                    <td>₹{p.mrp}</td>
                    <td>
                      <span style={{ color: low ? '#e06060' : 'var(--linen)', fontWeight: low ? 600 : 400 }}>
                        {low && <AlertTriangle size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--muted)' }}>{p.batch}</td>
                    <td style={{ color: 'var(--muted)' }}>{p.expiry}</td>
                    <td><span className={`badge ${low ? 'badge-danger' : 'badge-success'}`}>{low ? 'Low Stock' : 'OK'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><Edit2 size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</div>
            <div className="form-grid">
              {[['name','Product Name'],['company','Company'],['category','Category'],['mrp','MRP (₹)'],['stock','Stock Qty'],['minStock','Min Stock'],['batch','Batch No.'],['expiry','Expiry (YYYY-MM)'],['hsn','HSN Code']].map(([k, label]) => (
                <div className="form-group" key={k}>
                  <label className="input-label">{label}</label>
                  <input value={form[k] || ''} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} placeholder={label} />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={save}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
