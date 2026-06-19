import { MONTHLY_SALES, EMPLOYEES, PRODUCTS, SALES } from '../data'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'

const GOLD = '#c8893a'
const COLORS = ['#c8893a','#e0a84e','#4a7a6a','#3a6bc8','#b94040','#888']

export default function ReportsPage() {
  const employeeSales = EMPLOYEES.map(e => ({ name: e.name.split(' ')[0], sales: e.sales }))
  const catData = PRODUCTS.reduce((acc, p) => {
    const existing = acc.find(x => x.name === p.category)
    if (existing) existing.value++
    else acc.push({ name: p.category, value: 1 })
    return acc
  }, [])

  const totalRevenue = SALES.reduce((a,s) => a+s.total, 0)

  return (
    <div className="page-body">
      <div className="topbar">
        <div className="topbar-title">Reports & Analytics</div>
        <button className="btn btn-outline" onClick={() => window.print()}>Export PDF</button>
      </div>

      {/* SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Revenue (YTD)', value: `₹${(MONTHLY_SALES.reduce((a,m)=>a+m.revenue,0)/100000).toFixed(1)}L` },
          { label: 'Orders (YTD)',         value: MONTHLY_SALES.reduce((a,m)=>a+m.orders,0) },
          { label: 'Avg Monthly Revenue',  value: `₹${Math.round(MONTHLY_SALES.reduce((a,m)=>a+m.revenue,0)/MONTHLY_SALES.length).toLocaleString()}` },
          { label: 'Best Month',           value: 'June 2025' },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card-value">{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Monthly Revenue Trend</div></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SALES}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v=>`₹${v/1000}K`} tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
                <Bar dataKey="revenue" fill={GOLD} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Product Category Mix</div></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EMPLOYEE PERFORMANCE */}
      <div className="card">
        <div className="card-header"><div className="card-title">Employee Sales Performance</div></div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeeSales} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tickFormatter={v=>`₹${v/1000}K`} tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="sales" fill={GOLD} radius={[0,3,3,0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
