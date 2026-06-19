import { useState } from 'react'
import { PRODUCTS } from '../data'
import { AlertTriangle, Package, Plus, Minus } from 'lucide-react'

export default function StockPage() {
  const [products, setProducts] = useState(PRODUCTS)
  const [adjustId, setAdjustId] = useState(null)
  const [adjustQty, setAdjustQty] = useState('')
  const [adjustType, setAdjustType] = useState('add')

  const applyAdjust = () => {
    const qty = Number(adjustQty)
    if (!qty) return
    setProducts(prev => prev.map(p => p.id === adjustId
      ? { ...p, stock: adjustType === 'add' ? p.stock + qty : Math.max(0, p.stock - qty) }
      : p
    ))
    setAdjustId(null); setAdjustQty('')
  }

  const low = products.filter(p => p.stock < p.minStock)
  const ok  = products.filter(p => p.stock >= p.minStock)

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Stock Management</div>
      </div>

      {/* ALERTS */}
      {low.length > 0 && (
        <div style={{ background: 'rgba(185,64,64,0.08)', border: '1px solid rgba(185,64,64,0.2)', borderRadius: 6, padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <AlertTriangle size={18} color="#e06060" />
          <div>
            <div style={{ color: '#e06060', fontWeight: 500, fontSize: '0.88rem' }}>{low.length} products below minimum stock level</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: 2 }}>
              {low.map(p => p.name).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon"><Package size={16} color="var(--gold)" /></div>
          <div className="stat-card-value">{products.length}</div>
          <div className="stat-card-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(61,139,101,0.1)', borderColor: 'rgba(61,139,101,0.3)' }}>
            <Package size={16} color="#5dbd8e" />
          </div>
          <div className="stat-card-value">{ok.length}</div>
          <div className="stat-card-label">In Stock</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(185,64,64,0.1)', borderColor: 'rgba(185,64,64,0.3)' }}>
            <AlertTriangle size={16} color="#e06060" />
          </div>
          <div className="stat-card-value">{low.length}</div>
          <div className="stat-card-label">Low Stock</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Stock Levels</div>
          <div className="card-subtitle">Click Adjust to update inventory</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Current Stock</th><th>Min Stock</th><th>Level</th><th>Adjust</th></tr>
            </thead>
            <tbody>
              {products.map(p => {
                const pct = Math.min(100, Math.round((p.stock / (p.minStock * 2)) * 100))
                const isLow = p.stock < p.minStock
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td style={{ color: isLow ? '#e06060' : 'var(--linen)', fontWeight: isLow ? 600 : 400 }}>
                      {p.stock} units
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{p.minStock}</td>
                    <td style={{ minWidth: 100 }}>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: isLow ? '#b94040' : 'var(--gold)' }} />
                      </div>
                    </td>
                    <td>
                      {adjustId === p.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <select style={{ width: 70, padding: '0.3rem 0.4rem', fontSize: '0.75rem' }} value={adjustType} onChange={e => setAdjustType(e.target.value)}>
                            <option value="add">+Add</option>
                            <option value="sub">-Sub</option>
                          </select>
                          <input type="number" style={{ width: 60, padding: '0.3rem 0.5rem', fontSize: '0.75rem' }} value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="Qty" />
                          <button className="btn btn-gold btn-sm" onClick={applyAdjust}>Apply</button>
                          <button className="btn btn-outline btn-sm" onClick={() => setAdjustId(null)}>✕</button>
                        </div>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={() => { setAdjustId(p.id); setAdjustQty('') }}>
                          Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
