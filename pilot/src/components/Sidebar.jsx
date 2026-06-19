import { LayoutDashboard, Users, Package, ShoppingCart, Layers, ClipboardCheck, DollarSign, Stethoscope, Store, BoxesIcon, FileBarChart, ScrollText } from 'lucide-react'

const NAV = [
  { section: 'Overview' },
  { id: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
  { section: 'Operations' },
  { id: 'sales',      label: 'Sales',         icon: ShoppingCart },
  { id: 'products',   label: 'Products',      icon: Package },
  { id: 'stock',      label: 'Stock',         icon: Layers },
  { id: 'batches',    label: 'Batches',       icon: BoxesIcon },
  { section: 'People' },
  { id: 'employees',  label: 'Employees',     icon: Users },
  { id: 'attendance', label: 'Attendance',    icon: ClipboardCheck },
  { id: 'salary',     label: 'Salary',        icon: DollarSign },
  { section: 'Network' },
  { id: 'doctors',    label: 'Doctors',       icon: Stethoscope },
  { id: 'stockists',  label: 'Stockists',     icon: Store },
  { section: 'System' },
  { id: 'reports',    label: 'Reports',       icon: FileBarChart },
  { id: 'audit',      label: 'Audit Logs',    icon: ScrollText },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/pilot/favicon.ico" className="sidebar-logo-img" alt="BerryX Logo" />
        <div>
          <div className="sidebar-logo-text">BerryX Pilot</div>
          <div className="sidebar-logo-sub">Pharma Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item, i) => {
          if (item.section) return (
            <div key={i} className="sidebar-section-label">{item.section}</div>
          )
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
