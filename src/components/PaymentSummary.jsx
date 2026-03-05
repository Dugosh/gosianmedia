import {
  TEAMS, TEAM_ORDER,
  calculatePay, teamTotal, grandTotal,
  isChatterTeam, formatCurrency,
} from '../utils/calculations'

function TeamSummaryTable({ teamKey, members }) {
  if (members.length === 0) return null
  const config    = TEAMS[teamKey]
  const isChatter = isChatterTeam(teamKey)
  const total     = members.reduce((s, m) => s + calculatePay(m), 0)
  const paidCount = members.filter(m => m.paidStatus).length

  return (
    <div className="summary-team-section">
      <div className={`summary-team-title summary-team-${teamKey}`}>
        {config.label}{config.platform ? ` — ${config.platform}` : ''}
      </div>
      <div className="table-wrapper">
        <table className="staff-table" style={{ borderRadius: 0, borderTop: 'none' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              {isChatter ? (
                <>
                  <th>Hours</th>
                  <th>Net Sales</th>
                  <th>$/hr</th>
                  <th>Comm %</th>
                </>
              ) : (
                <>
                  <th>Pay Type</th>
                  <th>Rate / Salary</th>
                  <th>Hours</th>
                </>
              )}
              <th className="txt-right">Total Pay</th>
              <th>Paid</th>
              <th>Handle</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => {
              const pay = calculatePay(m)
              return (
                <tr key={m.id} style={{ opacity: m.roleLabel === 'Terminated' ? 0.6 : 1 }}>
                  <td className="muted">{i + 1}</td>
                  <td className="bold">{m.name}</td>
                  <td>
                    {m.roleLabel && m.roleLabel !== 'Regular' && (
                      <span className={`role-tag role-tag-${m.roleLabel.toLowerCase().replace(/\s+/g, '')}`}>
                        {m.roleLabel}
                      </span>
                    )}
                  </td>
                  {isChatter ? (
                    <>
                      <td className="muted">{m.hoursWorked || '—'}</td>
                      <td className="muted">{m.netSales ? formatCurrency(parseFloat(m.netSales)) : '—'}</td>
                      <td className="muted">${m.hourlyRate}/hr</td>
                      <td className="muted">{m.commissionRate}%</td>
                    </>
                  ) : (
                    <>
                      <td className="muted" style={{ textTransform: 'capitalize' }}>
                        {m.payType === 'hourly' ? 'Hourly' : 'Salary'}
                      </td>
                      <td className="muted">
                        {m.payType === 'hourly'
                          ? `$${m.hourlyRate}/hr`
                          : formatCurrency(parseFloat(m.salary) || 0)}
                      </td>
                      <td className="muted">{m.payType === 'hourly' ? (m.hoursWorked || '—') : '—'}</td>
                    </>
                  )}
                  <td className="amount txt-right">{formatCurrency(pay)}</td>
                  <td>
                    <span style={{
                      color: m.paidStatus ? 'var(--green)' : 'var(--text-m)',
                      fontWeight: 700, fontSize: '.8rem',
                    }}>
                      {m.paidStatus ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td className="muted" style={{ fontSize: '.75rem' }}>{m.wiseHandle || '—'}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={isChatter ? 7 : 5} style={{ fontSize: '.75rem', color: 'var(--text-m)' }}>
                {paidCount}/{members.length} paid
              </td>
              <td className="amount txt-right bold">{formatCurrency(total)}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default function PaymentSummary({ staffList, period }) {
  const total     = grandTotal(staffList)
  const paidTotal = staffList
    .filter(s => s.paidStatus)
    .reduce((sum, s) => sum + calculatePay(s), 0)
  const unpaidTotal = total - paidTotal

  if (staffList.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No staff added yet. Add team members in the Payroll tab.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Summary card */}
      <div className="card" id="payment-summary">
        <div className="summary-header">
          <div>
            <div className="card-title" style={{ marginBottom: 4, paddingBottom: 0, border: 'none' }}>
              Payment Summary
            </div>
            {period && <div className="summary-meta">Period: {period}</div>}
          </div>
          <button className="btn btn-ghost no-print" onClick={() => window.print()}>
            🖨 Print / Save PDF
          </button>
        </div>

        {/* Print header */}
        <div className="print-only company-header">
          <h1>Gosian Media</h1>
          <p>Payroll Report — {period || 'Current Period'}</p>
        </div>

        {/* Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <span className="stat-label">Total Staff</span>
            <span className="stat-value">{staffList.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Payroll</span>
            <span className="stat-value orange">{formatCurrency(total)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Remaining Unpaid</span>
            <span className="stat-value" style={{ color: unpaidTotal > 0 ? 'var(--red)' : 'var(--green)' }}>
              {formatCurrency(unpaidTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Team tables */}
      {TEAM_ORDER.map(key => (
        <div className="card" key={key} style={{ padding: 0, overflow: 'hidden' }}>
          <TeamSummaryTable
            teamKey={key}
            members={staffList.filter(s => s.team === key)}
          />
        </div>
      ))}

      {/* Grand total card */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
          {TEAM_ORDER.map(key => (
            <div key={key}>
              <div className="stat-label" style={{ marginBottom: 4 }}>{TEAMS[key].label}</div>
              <div style={{ fontWeight: 700, fontSize: '.9rem', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(teamTotal(staffList, key))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 14, borderTop: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--text-m)' }}>
            Total Period
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--orange)', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  )
}
