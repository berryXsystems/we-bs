import { useState } from 'react'
import { DOCTORS, EMPLOYEES } from '../data'
import { Search, Plus, Edit2 } from 'lucide-react'

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [doctors, setDoctors] = useState(DOCTORS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({})

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.hospital.toLowerCase().includes(search.toLowerCase())
  )

  const save = () => {
    setDoctors(prev => [...prev, { ...form, id: Date.now(), visits: 0 }])
    setShowModal(false); setForm({})
  }

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Doctors</div>
        <button className="btn btn-gold" onClick={() => setShowModal(true)}><Plus size={14}/> Add Doctor</button>
      </div>

      <div className="card" style={{ padding: '1rem 1.4rem' }}>
        <div className="search-bar">
          <Search size={14}/>
          <input placeholder="Search doctor, specialty, hospital..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Doctor</th><th>Specialty</th><th>Hospital</th><th>City</th><th>Assigned MR</th><th>Visits</th><th>Phone</th></tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="avatar" style={{ background: 'rgba(58,107,200,0.15)', borderColor: 'rgba(58,107,200,0.3)', color: '#7eaaeb' }}>
                        {d.name.split(' ').slice(1,3).map(n=>n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 500 }}>{d.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{d.specialty}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{d.hospital}</td>
                  <td>{d.city}</td>
                  <td>{d.assignedTo}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{d.visits}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--muted)' }}>{d.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">Add Doctor</div>
            <div className="form-grid">
              {[['name','Doctor Name'],['specialty','Specialty'],['hospital','Hospital'],['city','City'],['phone','Phone']].map(([k,label]) => (
                <div className="form-group" key={k}>
                  <label className="input-label">{label}</label>
                  <input value={form[k]||''} onChange={e => setForm(p=>({...p,[k]:e.target.value}))} placeholder={label} />
                </div>
              ))}
              <div className="form-group">
                <label className="input-label">Assigned MR</label>
                <select value={form.assignedTo||''} onChange={e => setForm(p=>({...p,assignedTo:e.target.value}))}>
                  <option value="">Select...</option>
                  {EMPLOYEES.map(e => <option key={e.id}>{e.name}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={save}>Save Doctor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
