import { AUDIT_LOGS } from '../data'
import { Shield } from 'lucide-react'

const ACTION_BADGE = {
  'Sale Created':     'badge-success',
  'Product Updated':  'badge-warning',
  'Employee Added':   'badge-info',
  'Salary Processed': 'badge-success',
  'Attendance Marked':'badge-neutral',
  'Stock Adjusted':   'badge-warning',
  'Login':            'badge-neutral',
  'Report Generated': 'badge-info',
}

export default function AuditLogsPage() {
  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Audit Logs</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
          <Shield size={14} color="var(--gold)" />
          Read-only system record
        </div>
      </div>

      <div className="card" style={{ padding: '1rem 1.4rem', background: 'rgba(200,137,58,0.04)', borderColor: 'rgba(200,137,58,0.15)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={14} color="var(--gold)" />
          All system actions are logged automatically and cannot be modified. This is a tamper-proof audit trail.
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">System Activity Log</div>
          <span className="badge badge-neutral">{AUDIT_LOGS.length} entries</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Action</th><th>User</th><th>Entity</th><th>Timestamp</th><th>IP Address</th></tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log, i) => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{String(log.id).padStart(4,'0')}</td>
                  <td><span className={`badge ${ACTION_BADGE[log.action] || 'badge-neutral'}`}>{log.action}</span></td>
                  <td style={{ fontWeight: 500 }}>{log.user}</td>
                  <td style={{ color: 'var(--muted)' }}>{log.entity}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'var(--muted)' }}>{log.time}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted)' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
