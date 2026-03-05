import { useState, useEffect } from 'react'
import PayrollView from './components/PayrollView'
import StaffForm from './components/StaffForm'
import PaymentSummary from './components/PaymentSummary'
import { generateId } from './utils/calculations'

function loadStaff() {
  try { return JSON.parse(localStorage.getItem('gm-staff') || '[]') } catch { return [] }
}
function loadPeriod() {
  try { return localStorage.getItem('gm-period') || '' } catch { return '' }
}

export default function App() {
  const [staffList,    setStaffList]    = useState(loadStaff)
  const [period,       setPeriod]       = useState(loadPeriod)
  const [activeTab,    setActiveTab]    = useState(0)
  const [editingStaff, setEditingStaff] = useState(null)
  const [defaultTeam,  setDefaultTeam]  = useState(null)

  useEffect(() => { localStorage.setItem('gm-staff',  JSON.stringify(staffList)) }, [staffList])
  useEffect(() => { localStorage.setItem('gm-period', period)                    }, [period])

  function handleSave(data) {
    if (editingStaff) {
      setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...data, id: editingStaff.id } : s))
    } else {
      setStaffList(prev => [...prev, { ...data, id: generateId(), paidStatus: false }])
    }
    setEditingStaff(null)
    setDefaultTeam(null)
    setActiveTab(0)
  }

  function handleEdit(staff) {
    setEditingStaff(staff)
    setDefaultTeam(null)
    setActiveTab(1)
  }

  function handleAddToTeam(teamKey) {
    setEditingStaff(null)
    setDefaultTeam(teamKey)
    setActiveTab(1)
  }

  function handleRemove(id) {
    setStaffList(prev => prev.filter(s => s.id !== id))
  }

  function handleTogglePaid(id) {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, paidStatus: !s.paidStatus } : s))
  }

  function handleCancelEdit() {
    setEditingStaff(null)
    setDefaultTeam(null)
    setActiveTab(0)
  }

  const periodLabel = period
    ? new Date(period + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  const tabLabels = [
    'Payroll',
    editingStaff ? 'Edit Staff' : 'Add Staff',
    'Summary',
  ]

  return (
    <div className="app">
      <header className="app-header no-print">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-logo">GM</div>
            <div className="brand-text">
              <h1>Gosian Media</h1>
              <p>Payroll Manager</p>
            </div>
          </div>
          <div className="period-field">
            <label>Pay Period</label>
            <input
              type="month"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            />
          </div>
        </div>

        <nav className="tabs">
          {tabLabels.map((tab, i) => (
            <button
              key={i}
              className={`tab ${activeTab === i ? 'tab-active' : ''}`}
              onClick={() => {
                if (i !== 1) { setEditingStaff(null); setDefaultTeam(null) }
                setActiveTab(i)
              }}
            >
              {tab}
              {i === 0 && staffList.length > 0 && (
                <span className="tab-badge">{staffList.length}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 0 && (
          <PayrollView
            staffList={staffList}
            period={periodLabel}
            onEdit={handleEdit}
            onRemove={handleRemove}
            onTogglePaid={handleTogglePaid}
            onAddToTeam={handleAddToTeam}
          />
        )}
        {activeTab === 1 && (
          <StaffForm
            key={editingStaff?.id ?? 'new'}
            initialData={editingStaff}
            defaultTeam={defaultTeam}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
        {activeTab === 2 && (
          <PaymentSummary
            staffList={staffList}
            period={periodLabel}
          />
        )}
      </main>

      <footer className="app-footer no-print">
        <p>Gosian Media &copy; {new Date().getFullYear()} — Internal Payroll Tool</p>
      </footer>
    </div>
  )
}
