import { useState } from 'react'
import { EMPLOYEES } from '../data'
import { Search, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react'

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [employees, setEmployees] = useState(EMPLOYEES)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.role.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || e.status === filter
    return matchSearch && matchFilter
  })

  const openAdd = () => { setEditing(null); setForm({ status: 'Active' }); setShowModal(true) }
  const openEdit = (emp) => { setEditing(emp); setForm({ ...emp }); setShowModal(true) }

  const save = () => {
    if (editing) {
      setEmployees(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } : e))
    } else {
      setEmployees(prev => [...prev, { ...form, id: Date.now(), avatar: form.name?.slice(0,2).toUpperCase() || 'XX', sales: 0, target: 180000 }])
    }
    setShowModal(false)
  }

  const del = (id) => setEmployees(prev => prev.filter(e => e.id !== id))

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Employees</div>
        <button className="btn btn-gold" onClick={openAdd}><Plus size={14} /> Add Employee</button>
      </div>

      {/* FILTERS */}
      <div className="card" style={{ padding: '1rem 1.4rem' }}>
        <div className="filters-row">
          <div className="search-bar">
            <Search size={14} />
            <input placeholder="Search name, role..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="tab-group">
            {['All', 'Active', 'Inactive'].map(f => (
              <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--muted)' }}>
            {filtered.length} of {employees.length} employees
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th><th>Role</th><th>Zone</th><th>Salary</th>
                <th>Sales vs Target</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const pct = Math.round((emp.sales / emp.target) * 100)
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div className="avatar">{emp.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--linen)' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.role}</td>
                    <td>{emp.zone}</td>
                    <td>₹{emp.salary?.toLocaleString()}</td>
                    <td style={{ minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="progress-bar-bg" style={{ flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? 'var(--success)' : 'var(--gold)' }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: pct >= 100 ? '#5dbd8e' : 'var(--gold)', fontWeight: 600, minWidth: 32 }}>{pct}%</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>
                        ₹{emp.sales?.toLocaleString()} / ₹{emp.target?.toLocaleString()}
                      </div>
                    </td>
                    <td><span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{emp.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(emp)}><Edit2 size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(emp.id)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editing ? 'Edit Employee' : 'Add Employee'}</div>
            <div className="form-grid">
              {[['name','Full Name'],['role','Role'],['zone','Zone'],['phone','Phone'],['email','Email'],['salary','Base Salary']].map(([k, label]) => (
                <div className="form-group" key={k}>
                  <label className="input-label">{label}</label>
                  <input value={form[k] || ''} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} placeholder={label} />
                </div>
              ))}
              <div className="form-group">
                <label className="input-label">Status</label>
                <select value={form.status || 'Active'} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={save}>Save Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
