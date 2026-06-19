import { useState } from 'react'
import { SALARY } from '../data'
import { CheckCircle, Clock } from 'lucide-react'

export default function SalaryPage() {
  const [salary, setSalary] = useState(SALARY)

  const markProcessed = (id) => setSalary(prev => prev.map(s => s.id === id ? { ...s, status: 'Processed' } : s))

  const totalNet = salary.reduce((a, s) => a + s.net, 0)
  const processed = salary.filter(s => s.status === 'Processed')
  const pending   = salary.filter(s => s.status === 'Pending')

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Salary & Payroll</div>
        <span className="topbar-badge">June 2025</span>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Payroll', value: `₹${totalNet.toLocaleString()}`, color: 'var(--gold)' },
          { label: 'Employees', value: salary.length },
          { label: 'Processed', value: processed.length, color: '#5dbd8e' },
          { label: 'Pending', value: pending.length, color: '#e06060' },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card-value" style={c.color ? { color: c.color } : {}}>{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Payroll Details</div>
          {pending.length > 0 && (
            <button className="btn btn-gold btn-sm" onClick={() => setSalary(prev => prev.map(s => ({...s, status: 'Processed'})))}>
              Process All ({pending.length})
            </button>
          )}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employee</th><th>Base Salary</th><th>Incentive</th><th>Deduction</th><th>Net Pay</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {salary.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.employee}</td>
                  <td>₹{s.base.toLocaleString()}</td>
                  <td style={{ color: '#5dbd8e' }}>+₹{s.incentive.toLocaleString()}</td>
                  <td style={{ color: s.deduction > 0 ? '#e06060' : 'var(--muted)' }}>
                    {s.deduction > 0 ? `-₹${s.deduction.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.95rem' }}>₹{s.net.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${s.status === 'Processed' ? 'badge-success' : 'badge-warning'}`}>
                      {s.status === 'Processed' ? <CheckCircle size={10} style={{ marginRight: 3 }} /> : <Clock size={10} style={{ marginRight: 3 }} />}
                      {s.status}
                    </span>
                  </td>
                  <td>
                    {s.status === 'Pending' && (
                      <button className="btn btn-gold btn-sm" onClick={() => markProcessed(s.id)}>Process</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
