import { useState } from 'react'
import StaffForm from './components/StaffForm'
import StaffList from './components/StaffList'
import PaymentSummary from './components/PaymentSummary'

const TABS = ['Add Staff', 'Staff List', 'Payment Summary']

export default function App() {
  const [staffList, setStaffList] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [period, setPeriod] = useState('')

  function addStaff(staff) {
    setStaffList(prev => [...prev, staff])
    setActiveTab(1) // jump to staff list after adding
  }

  function removeStaff(id) {
    setStaffList(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header no-print">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">💰</span>
            <div>
              <h1>Gosian Media</h1>
              <p>Staff Payment Calculator</p>
            </div>
          </div>
          <div className="period-field">
            <label>Payment Period</label>
            <input
              type="month"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <nav className="tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`tab ${activeTab === i ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
              {i === 1 && staffList.length > 0 && (
                <span className="tab-badge">{staffList.length}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="main-content">
        {activeTab === 0 && <StaffForm onAdd={addStaff} />}
        {activeTab === 1 && (
          <StaffList staffList={staffList} onRemove={removeStaff} />
        )}
        {activeTab === 2 && (
          <PaymentSummary
            staffList={staffList}
            period={period ? new Date(period + '-01').toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) : ''}
          />
        )}
      </main>

      <footer className="app-footer no-print">
        <p>Gosian Media &copy; {new Date().getFullYear()} — Staff Payment Calculator</p>
      </footer>
    </div>
  )
}
