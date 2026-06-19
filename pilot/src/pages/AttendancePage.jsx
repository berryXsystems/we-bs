import { useState } from 'react'
import { ATTENDANCE } from '../data'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Mon','Tue','Wed','Thu','Fri','Sat','Mon','Tue','Wed','Thu','Fri','Sat','Mon','Tue','Wed','Thu','Fri','Sat','Mon','Sat']

export default function AttendancePage() {
  const [month, setMonth] = useState('June 2025')
  const [records, setRecords] = useState(ATTENDANCE)

  const update = (id, field, val) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: Number(val) } : r))
  }

  const totals = records.reduce((acc, r) => ({
    present: acc.present + r.present,
    absent:  acc.absent  + r.absent,
    leaves:  acc.leaves  + r.leaves,
  }), { present: 0, absent: 0, leaves: 0 })

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Attendance</div>
        <div className="topbar-right">
          <select style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }} value={month} onChange={e => setMonth(e.target.value)}>
            {['April 2025','May 2025','June 2025'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Present Days', value: totals.present, color: '#5dbd8e' },
          { label: 'Total Absent Days',  value: totals.absent,  color: '#e06060' },
          { label: 'Total Leave Days',   value: totals.leaves,  color: 'var(--gold)' },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Monthly Attendance — {month}</div>
          <span className="badge badge-info">{records.length} employees</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Half Day</th>
                <th>Leaves</th>
                <th>Overtime (hrs)</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => {
                const workingDays = r.present + r.absent + r.halfDay
                const pct = Math.round((r.present / (workingDays || 26)) * 100)
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.employee}</td>
                    <td>
                      <input type="number" style={{ width: 60, padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                        value={r.present} onChange={e => update(r.id, 'present', e.target.value)} />
                    </td>
                    <td>
                      <input type="number" style={{ width: 60, padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                        value={r.absent} onChange={e => update(r.id, 'absent', e.target.value)} />
                    </td>
                    <td>{r.halfDay}</td>
                    <td>{r.leaves}</td>
                    <td style={{ color: 'var(--gold)' }}>{r.overtime}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="progress-bar-bg" style={{ width: 80 }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--success)' : pct >= 75 ? 'var(--gold)' : '#b94040' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: pct >= 90 ? '#5dbd8e' : pct >= 75 ? 'var(--gold)' : '#e06060' }}>{pct}%</span>
                      </div>
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
