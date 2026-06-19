import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import EmployeesPage from './pages/EmployeesPage'
import ProductsPage from './pages/ProductsPage'
import SalesPage from './pages/SalesPage'
import StockPage from './pages/StockPage'
import AttendancePage from './pages/AttendancePage'
import SalaryPage from './pages/SalaryPage'
import DoctorsPage from './pages/DoctorsPage'
import StockistsPage from './pages/StockistsPage'
import BatchesPage from './pages/BatchesPage'
import ReportsPage from './pages/ReportsPage'
import AuditLogsPage from './pages/AuditLogsPage'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const pages = {
    dashboard:  <Dashboard />,
    employees:  <EmployeesPage />,
    products:   <ProductsPage />,
    sales:      <SalesPage />,
    stock:      <StockPage />,
    attendance: <AttendancePage />,
    salary:     <SalaryPage />,
    doctors:    <DoctorsPage />,
    stockists:  <StockistsPage />,
    batches:    <BatchesPage />,
    reports:    <ReportsPage />,
    audit:      <AuditLogsPage />,
  }

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={setPage} />
      <div className="main-content">
        <div className="demo-banner">
          ✦ BerryX Pilot — Interactive Demo &nbsp;·&nbsp; All data is illustrative &nbsp;·&nbsp; Powered by BerryX Systems
        </div>
        {pages[page] || <Dashboard />}
      </div>
    </div>
  )
}
