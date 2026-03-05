import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TeamView from './components/TeamView';
import PaymentSummary from './components/PaymentSummary';
import ManageStaff from './components/ManageStaff';
import { DEFAULT_STAFF, TEAM_ORDER } from './data/defaultStaff';
import { getPayPeriods } from './utils/calculations';

// ─── Persistence helpers ───────────────────────────────────
const STORAGE_KEYS = {
  staff: 'gm-staff-v2',
  periodData: 'gm-period-data',
  revenue: 'gm-revenue-data',
  month: 'gm-selected-month',
  periodIdx: 'gm-period-idx',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function getInitialStaff() {
  const saved = load(STORAGE_KEYS.staff, null);
  return saved || DEFAULT_STAFF;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ─── App ───────────────────────────────────────────────────
export default function App() {
  const [staffList, setStaffList] = useState(getInitialStaff);
  const [selectedMonth, setSelectedMonth] = useState(() => load(STORAGE_KEYS.month, getCurrentMonth()));
  const [periodIndex, setPeriodIndex] = useState(() => load(STORAGE_KEYS.periodIdx, 0));
  const [periodDataMap, setPeriodDataMap] = useState(() => load(STORAGE_KEYS.periodData, {}));
  const [revenueData, setRevenueData] = useState(() => load(STORAGE_KEYS.revenue, {}));
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Persist
  useEffect(() => save(STORAGE_KEYS.staff, staffList), [staffList]);
  useEffect(() => save(STORAGE_KEYS.periodData, periodDataMap), [periodDataMap]);
  useEffect(() => save(STORAGE_KEYS.revenue, revenueData), [revenueData]);
  useEffect(() => save(STORAGE_KEYS.month, selectedMonth), [selectedMonth]);
  useEffect(() => save(STORAGE_KEYS.periodIdx, periodIndex), [periodIndex]);

  // Derived
  const [year, month] = selectedMonth.split('-').map(Number);
  const periods = getPayPeriods(year, month);
  const currentPeriod = periods[periodIndex] || periods[0];
  const periodKey = `${selectedMonth}-p${periodIndex}`;
  const currentPeriodData = periodDataMap[periodKey] || {};
  const currentRevenue = revenueData[periodKey] || {};

  const payPeriodLabel = currentPeriod
    ? `${currentPeriod.label}, ${year} — Pay Date: ${month}/${currentPeriod.payDate}`
    : '';

  // ─── Handlers ────────────────────────────────────────────
  const updatePeriodData = useCallback((staffId, updates) => {
    setPeriodDataMap(prev => ({
      ...prev,
      [periodKey]: {
        ...prev[periodKey],
        [staffId]: { ...(prev[periodKey]?.[staffId] || {}), ...updates },
      },
    }));
  }, [periodKey]);

  const togglePaid = useCallback((staffId) => {
    setPeriodDataMap(prev => {
      const existing = prev[periodKey]?.[staffId] || {};
      return {
        ...prev,
        [periodKey]: {
          ...prev[periodKey],
          [staffId]: { ...existing, paid: !existing.paid },
        },
      };
    });
  }, [periodKey]);

  const updateRevenue = useCallback((updates) => {
    setRevenueData(prev => ({
      ...prev,
      [periodKey]: { ...(prev[periodKey] || {}), ...updates },
    }));
  }, [periodKey]);

  const updateStaff = useCallback((id, updates) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const removeStaff = useCallback((id) => {
    if (window.confirm('Remove this team member?')) {
      setStaffList(prev => prev.filter(s => s.id !== id));
    }
  }, []);

  const addStaff = useCallback((newStaff) => {
    setStaffList(prev => [...prev, newStaff]);
  }, []);

  const handleAddStaffFromTeam = useCallback((teamKey) => {
    setActiveView('manage');
  }, []);

  // ─── Render ──────────────────────────────────────────────
  const renderView = () => {
    if (activeView === 'dashboard') {
      return (
        <Dashboard
          staffList={staffList}
          periodDataMap={currentPeriodData}
          revenueData={currentRevenue}
          payPeriod={payPeriodLabel}
          onNavigate={setActiveView}
        />
      );
    }

    if (activeView === 'summary') {
      return (
        <PaymentSummary
          staffList={staffList}
          periodDataMap={currentPeriodData}
          revenueData={currentRevenue}
          payPeriodLabel={payPeriodLabel}
        />
      );
    }

    if (activeView === 'manage') {
      return (
        <ManageStaff
          staffList={staffList}
          onUpdateStaff={updateStaff}
          onRemoveStaff={removeStaff}
          onAddStaff={addStaff}
        />
      );
    }

    // Team views
    const teamMatch = activeView.match(/^team-(.+)$/);
    if (teamMatch) {
      const teamKey = teamMatch[1];
      return (
        <TeamView
          teamKey={teamKey}
          staffList={staffList}
          periodDataMap={currentPeriodData}
          revenueData={currentRevenue}
          onUpdatePeriodData={updatePeriodData}
          onTogglePaid={togglePaid}
          onUpdateRevenue={updateRevenue}
          onEditStaff={(s) => { setActiveView('manage'); }}
          onAddStaff={handleAddStaffFromTeam}
        />
      );
    }

    return <Dashboard staffList={staffList} periodDataMap={currentPeriodData} revenueData={currentRevenue} onNavigate={setActiveView} />;
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        staffList={staffList}
        periodDataMap={currentPeriodData}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
      />

      <div className="main-area">
        {/* Top bar */}
        <header className="topbar no-print">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarCollapsed(c => !c)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
          <div className="topbar-center">
            <div className="period-selector">
              <label>Period</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="month-input"
              />
              <div className="period-toggle">
                {periods.map((p, i) => (
                  <button
                    key={i}
                    className={`period-btn ${periodIndex === i ? 'period-btn-active' : ''}`}
                    onClick={() => setPeriodIndex(i)}
                  >
                    {p.start}–{p.end}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="pay-date-badge">
              Pay Date: {month}/{currentPeriod?.payDate}
            </span>
          </div>
        </header>

        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
