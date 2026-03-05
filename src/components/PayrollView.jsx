import { useState } from 'react'
import {
  TEAMS, TEAM_ORDER,
  calculatePay, teamTotal, grandTotal,
  isChatterTeam, formatCurrency
} from '../utils/calculations'

function roleClass(roleLabel) {
  if (!roleLabel) return ''
  const r = roleLabel.toLowerCase().replace(/\s+/g, '')
  if (r === 'teamlead' || r === 'lead') return 'role-teamlead'
  if (r === 'manager')    return 'role-manager'
  if (r === 'terminated') return 'role-terminated'
  return ''
}

function RoleTag({ label }) {
  if (!label || label === 'Regular') return null
  const cls = label.toLowerCase().replace(/\s+/g, '')
  return <span className={`role-tag role-tag-${cls}`}>{label}</span>
}

function TeamSection({ teamKey, members, onEdit, onRemove, onTogglePaid, onAddToTeam }) {
  const [open, setOpen] = useState(true)
  const config   = TEAMS[teamKey]
  const isChatter = isChatterTeam(teamKey)
  const total    = members.reduce((s, m) => s + calculatePay(m), 0)
  const paidCount = members.filter(m => m.paidStatus).length

  if (members.length === 0 && teamKey !== 'OF' && teamKey !== 'Admin') {
    // still show section so user can add members
  }

  return (
    <div className="team-section">
      {/* Header */}
      <div className="team-section-header" onClick={() => setOpen(o => !o)}>
        <div className="team-header-left">
          <span className="team-dot" style={{ background: config.color }} />
          <span className="team-name">{config.label}</span>
          {members.length > 0 && (
            <span className="team-count">{members.length}</span>
          )}
          {config.platform && (
            <span className={`badge badge-${teamKey}`}>{config.platform}</span>
          )}
        </div>
        <div className="team-header-right">
          {members.length > 0 && (
            <span className="paid-progress">
              <span className="paid-yes">{paidCount}</span>/{members.length} paid
            </span>
          )}
          <span className="team-total-h">{formatCurrency(total)}</span>
          <button className={`collapse-btn ${open ? 'open' : ''}`}>▾</button>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="team-section-body">
          {members.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 18px' }}>
              <p>No members yet.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
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
                    <th style={{ textAlign: 'center' }}>Paid</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, i) => {
                    const pay  = calculatePay(m)
                    const rCls = roleClass(m.roleLabel)
                    return (
                      <tr key={m.id} className={rCls}>
                        <td className="muted">{i + 1}</td>
                        <td>
                          <div className="member-name-cell">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className="member-name">{m.name}</span>
                              <RoleTag label={m.roleLabel} />
                            </div>
                            {m.wiseHandle && (
                              <span className="member-wise">{m.wiseHandle}</span>
                            )}
                          </div>
                        </td>
                        {isChatter ? (
                          <>
                            <td className="muted">{m.hoursWorked || '—'}</td>
                            <td className="muted">
                              {m.netSales ? formatCurrency(parseFloat(m.netSales)) : '—'}
                            </td>
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
                            <td className="muted">
                              {m.payType === 'hourly' ? (m.hoursWorked || '—') : '—'}
                            </td>
                          </>
                        )}
                        <td className="amount txt-right">{formatCurrency(pay)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className={`paid-toggle ${m.paidStatus ? 'is-paid' : ''}`}
                            onClick={() => onTogglePaid(m.id)}
                            title={m.paidStatus ? 'Mark unpaid' : 'Mark paid'}
                          >
                            {m.paidStatus ? '✓' : ''}
                          </button>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="btn-icon-edit"
                              onClick={() => onEdit(m)}
                              title="Edit"
                            >
                              ✎
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => onRemove(m.id)}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={isChatter ? 6 : 4} className="muted" style={{ fontSize: '.75rem' }}>
                      {paidCount}/{members.length} paid
                    </td>
                    <td className="amount txt-right">{formatCurrency(total)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="team-add-row">
            <button className="btn-add-member" onClick={() => onAddToTeam(teamKey)}>
              + Add Member
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PayrollView({ staffList, period, onEdit, onRemove, onTogglePaid, onAddToTeam }) {
  const total = grandTotal(staffList)

  return (
    <div>
      {period && (
        <p className="muted" style={{ fontSize: '.78rem', marginBottom: 14 }}>
          Period: <strong style={{ color: 'var(--text-2)' }}>{period}</strong>
        </p>
      )}

      {TEAM_ORDER.map(key => (
        <TeamSection
          key={key}
          teamKey={key}
          members={staffList.filter(s => s.team === key)}
          onEdit={onEdit}
          onRemove={onRemove}
          onTogglePaid={onTogglePaid}
          onAddToTeam={onAddToTeam}
        />
      ))}

      {/* Grand totals */}
      <div className="grand-totals">
        <div className="grand-totals-grid">
          {TEAM_ORDER.map(key => (
            <div className="totals-item" key={key}>
              <span className="totals-item-label">{TEAMS[key].label}</span>
              <span className="totals-item-value">{formatCurrency(teamTotal(staffList, key))}</span>
            </div>
          ))}
        </div>
        <div className="grand-total-row">
          <span className="grand-total-label">Total Period</span>
          <span className="grand-total-value">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
