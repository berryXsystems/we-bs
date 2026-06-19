import { EMPLOYEES, PRODUCTS, SALES, MONTHLY_SALES } from '../data'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Users, Package, ShoppingCart, TrendingUp, AlertTriangle, IndianRupee } from 'lucide-react'

const GOLD = '#dfb76c'
const GOLD2 = '#f2ddb3'

function StatCard({ icon: Icon, label, value, change, sub, danger }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={danger ? { borderColor: 'rgba(185,64,64,0.3)', background: 'rgba(185,64,64,0.08)' } : {}}>
        <Icon size={16} color={danger ? '#e06060' : GOLD} />
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {change && <div className={`stat-card-change ${change > 0 ? 'up' : 'down'}`}>
        <TrendingUp size={11} />
        {Math.abs(change)}% vs last month
      </div>}
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.35rem' }}>{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.6rem 0.9rem', fontSize: '0.78rem' }}>
      <div style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => <div key={p.name} style={{ color: GOLD }}>₹{p.value?.toLocaleString()}</div>)}
    </div>
  )
}

export default function Dashboard() {
  const totalRevenue = SALES.reduce((s, x) => s + x.total, 0)
  const lowStock = PRODUCTS.filter(p => p.stock < p.minStock)
  const topEmployees = [...EMPLOYEES].sort((a, b) => b.sales - a.sales).slice(0, 5)

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Dashboard</div>
        <div className="topbar-right">
          <span className="topbar-badge">June 2025</span>
        </div>
      </div>

      {/* KPI STATS */}
      <div className="stat-grid">
        <StatCard icon={Users}         label="Total Employees"   value={EMPLOYEES.length}  change={12}  />
        <StatCard icon={Package}       label="Products"          value={PRODUCTS.length}   sub="In catalogue" />
        <StatCard icon={ShoppingCart}  label="Sales This Month"  value={SALES.length}      change={8} />
        <StatCard icon={IndianRupee}   label="Revenue"           value={`₹${(totalRevenue/1000).toFixed(0)}K`} change={14} />
        <StatCard icon={TrendingUp}    label="Avg Order Value"   value={`₹${Math.round(totalRevenue/SALES.length).toLocaleString()}`} />
        <StatCard icon={AlertTriangle} label="Low Stock Items"   value={lowStock.length}   danger={lowStock.length > 0} sub={lowStock.length > 0 ? 'Needs restocking' : 'All good'} />
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>

        {/* Monthly Revenue */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Revenue</div>
              <div className="card-subtitle">Jan – Jun 2025</div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SALES} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill={GOLD} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Order Volume Trend</div>
              <div className="card-subtitle">Orders per month</div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_SALES}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
                <Line type="monotone" dataKey="orders" stroke={GOLD2} strokeWidth={2} dot={{ fill: GOLD2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>

        {/* Top Performers */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Performers</div>
          </div>
          {topEmployees.map((emp, i) => {
            const pct = Math.round((emp.sales / emp.target) * 100)
            return (
              <div key={emp.id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.4rem' }}>
                  <div className="avatar" style={{ background: i === 0 ? 'rgba(200,137,58,0.2)' : undefined }}>{emp.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.83rem', color: 'var(--linen)', fontWeight: 500 }}>{emp.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{emp.role}</div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: pct >= 100 ? '#5dbd8e' : 'var(--gold)', fontWeight: 600 }}>
                    {pct}%
                  </div>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? 'var(--success)' : 'var(--gold)' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ color: lowStock.length > 0 ? '#e06060' : undefined }}>
              Low Stock Alerts
            </div>
            <span className="badge badge-danger">{lowStock.length} items</span>
          </div>
          {lowStock.length === 0 ? (
            <div className="empty-state"><div>All stock levels are healthy ✓</div></div>
          ) : (
            <table>
              <thead>
                <tr><th>Product</th><th>Stock</th><th>Min</th></tr>
              </thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td style={{ color: '#e06060', fontWeight: 600 }}>{p.stock}</td>
                    <td style={{ color: 'var(--muted)' }}>{p.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
