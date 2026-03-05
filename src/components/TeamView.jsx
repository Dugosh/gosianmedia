import React, { useState } from 'react';
import { TEAM_CONFIG, ROLE_DISPLAY } from '../data/defaultStaff';
import { calculateStaffPay, formatCurrency, getCompDescription, teamTotal } from '../utils/calculations';

function CompBreakdown({ comp, breakdown }) {
  if (!breakdown) return null;

  if (breakdown.isManual) {
    return breakdown.bonus > 0
      ? <span className="pay-breakdown">manual + {formatCurrency(breakdown.bonus)} bonus</span>
      : <span className="pay-breakdown pay-manual-badge">manual override</span>;
  }

  const bonusPart = breakdown.bonus > 0 ? ` + ${formatCurrency(breakdown.bonus)} bonus` : '';

  switch (comp.type) {
    case 'hourly_commission':
      return <span className="pay-breakdown">{formatCurrency(breakdown.hoursPay)} hrs + {formatCurrency(breakdown.commPay)} comm{bonusPart}</span>;
    case 'manager':
      return <span className="pay-breakdown">{formatCurrency(breakdown.basePay)} base + {formatCurrency(breakdown.commPay)} comm{bonusPart}</span>;
    case 'terminated_hourly':
      return <span className="pay-breakdown">{formatCurrency(breakdown.hoursPay)} hrs{bonusPart}</span>;
    case 'sliding_scale':
      return <span className="pay-breakdown">{formatCurrency(breakdown.spPay)} SP ({breakdown.rate}%) + {formatCurrency(breakdown.outreachPay)} outreach{bonusPart}</span>;
    case 'revenue_share':
      return (
        <span className="pay-breakdown">
          {[
            breakdown.spPay  > 0 && `${formatCurrency(breakdown.spPay)} SP`,
            breakdown.ofPay  > 0 && `${formatCurrency(breakdown.ofPay)} OF`,
            breakdown.fanslyPay > 0 && `${formatCurrency(breakdown.fanslyPay)} Fansly`,
          ].filter(Boolean).join(' + ')}{bonusPart}
        </span>
      );
    case 'model_scout':
      return <span className="pay-breakdown pay-manual-badge">enter manual pay ↑</span>;
    case 'manual':
      return <span className="pay-breakdown pay-manual-badge">enter manual pay ↑</span>;
    case 'internal_admin':
      return <span className="pay-breakdown">{formatCurrency(breakdown.spPay)} SP + {formatCurrency(breakdown.fanslyPay)} Fansly{bonusPart}</span>;
    case 'va_regular':
      return <span className="pay-breakdown">{formatCurrency(breakdown.monthlyPortion)} flat + {formatCurrency(breakdown.hoursPay)} hrs{bonusPart}</span>;
    case 'va_lead':
      return <span className="pay-breakdown">{formatCurrency(breakdown.monthlyPortion)} flat{bonusPart}</span>;
    default:
      return bonusPart ? <span className="pay-breakdown">{bonusPart.trim()}</span> : null;
  }
}

function StaffRow({ staff, periodData, revenueData, onUpdatePeriodData, onTogglePaid }) {
  const [showOverride, setShowOverride] = useState(false);
  const comp = staff.comp;
  const pd = periodData || {};
  const { total, breakdown } = calculateStaffPay(staff, pd, revenueData);
  const isPaid = pd.paid || false;
  const hasManualPay = pd.manualPay !== undefined && pd.manualPay !== '';
  const hasBonus = pd.bonus && parseFloat(pd.bonus) > 0;

  const isManualComp = comp.type === 'manual' || comp.type === 'model_scout';
  const needsHours = ['hourly_commission', 'terminated_hourly', 'va_regular'].includes(comp.type);
  const needsSales = comp.type === 'hourly_commission';
  const needsTeamSales = comp.type === 'manager';
  const isAdmin = ['sliding_scale', 'revenue_share', 'internal_admin', 'model_scout', 'manual'].includes(comp.type);
  const isVaLead = comp.type === 'va_lead';
  const roleLabel = ROLE_DISPLAY[staff.role] || '';

  return (
    <>
      <tr className={`staff-row ${isPaid ? 'staff-row-paid' : ''}`}>
        <td className="cell-name">
          <div className="name-group">
            <span className="staff-name">{staff.name}</span>
            {roleLabel && <span className={`role-chip role-${staff.role}`}>{roleLabel}</span>}
            {(hasManualPay || isManualComp) && (
              <span className="role-chip" style={{background:'rgba(234,179,8,.12)',color:'#eab308'}}>Manual</span>
            )}
          </div>
          <div className="comp-desc">{getCompDescription(comp)}</div>
        </td>

        {/* Hours */}
        <td className="cell-input">
          {needsHours ? (
            <input type="number" className="inline-input" placeholder="0"
              value={pd.hoursWorked || ''}
              onChange={e => onUpdatePeriodData(staff.id, { hoursWorked: e.target.value })}
              min="0" step="0.5" />
          ) : <span className="cell-na">—</span>}
        </td>

        {/* Net Sales */}
        <td className="cell-input">
          {needsSales ? (
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input type="number" className="inline-input" placeholder="0.00"
                value={pd.netSales || ''}
                onChange={e => onUpdatePeriodData(staff.id, { netSales: e.target.value })}
                min="0" step="0.01" />
            </div>
          ) : needsTeamSales ? (
            <span className="cell-hint">Uses team total</span>
          ) : (
            <span className="cell-na">—</span>
          )}
        </td>

        {/* Pay */}
        <td className="cell-pay">
          <div className="pay-amount">{formatCurrency(total)}</div>
          <CompBreakdown comp={comp} breakdown={breakdown} />
        </td>

        {/* Override / bonus toggle + paid */}
        <td className="cell-action" style={{minWidth: 64}}>
          <div style={{display:'flex', alignItems:'center', gap:4, justifyContent:'center'}}>
            <button
              className={`override-toggle ${(showOverride || hasManualPay || hasBonus) ? 'override-toggle-active' : ''}`}
              onClick={() => setShowOverride(v => !v)}
              title="Bonus / manual override"
            >
              {hasManualPay || hasBonus ? '★' : '+'}
            </button>
            <button
              className={`paid-btn ${isPaid ? 'paid-btn-yes' : 'paid-btn-no'}`}
              onClick={() => onTogglePaid(staff.id)}
              title={isPaid ? 'Mark unpaid' : 'Mark paid'}
            >
              {isPaid ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* Expandable override / bonus row */}
      {(showOverride || isManualComp) && (
        <tr className="override-row">
          <td colSpan="5">
            <div className="override-panel">
              <div className="override-field">
                <label>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Manual Pay Override
                </label>
                <div className="input-with-prefix" style={{maxWidth:140}}>
                  <span className="input-prefix">$</span>
                  <input type="number" placeholder="0.00"
                    value={pd.manualPay !== undefined ? pd.manualPay : ''}
                    onChange={e => onUpdatePeriodData(staff.id, { manualPay: e.target.value })}
                    min="0" step="0.01" />
                </div>
                <span className="override-hint">Bypasses all calculated pay</span>
                {hasManualPay && (
                  <button className="btn-icon override-clear" onClick={() => onUpdatePeriodData(staff.id, { manualPay: '' })} title="Clear override">
                    ✕ clear
                  </button>
                )}
              </div>
              <div className="override-field">
                <label>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Bonus
                </label>
                <div className="input-with-prefix" style={{maxWidth:140}}>
                  <span className="input-prefix">$</span>
                  <input type="number" placeholder="0.00"
                    value={pd.bonus || ''}
                    onChange={e => onUpdatePeriodData(staff.id, { bonus: e.target.value })}
                    min="0" step="0.01" />
                </div>
                <span className="override-hint">Added on top of pay</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function RevenueInputs({ teamKey, revenueData, onUpdateRevenue }) {
  if (teamKey === 'Admin') {
    return (
      <div className="revenue-inputs">
        <h4 className="revenue-title">Platform Revenue</h4>
        <div className="revenue-grid">
          <div className="revenue-field">
            <label>SP Gross Revenue <span style={{color:'var(--text-m)',fontWeight:300}}>(fees already accounted for)</span></label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input type="number" placeholder="0.00"
                value={revenueData?.spGrossRevenue || ''}
                onChange={e => onUpdateRevenue({ spGrossRevenue: e.target.value })} />
            </div>
          </div>
          <div className="revenue-field">
            <label>OF Gross Revenue <span style={{color:'var(--text-m)',fontWeight:300}}>(after 20% platform fee)</span></label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input type="number" placeholder="0.00"
                value={revenueData?.ofGrossRevenue || ''}
                onChange={e => onUpdateRevenue({ ofGrossRevenue: e.target.value })} />
            </div>
          </div>
          <div className="revenue-field">
            <label>Fansly Gross Revenue <span style={{color:'var(--text-m)',fontWeight:300}}>(fees already accounted for)</span></label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input type="number" placeholder="0.00"
                value={revenueData?.fanslyGrossRevenue || ''}
                onChange={e => onUpdateRevenue({ fanslyGrossRevenue: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chatter teams with a manager need team net sales for manager commission
  const hasManager = teamKey === 'OF' || teamKey === 'Fansly';
  if (hasManager) {
    return (
      <div className="revenue-inputs">
        <h4 className="revenue-title">Team Revenue</h4>
        <div className="revenue-grid">
          <div className="revenue-field">
            <label>Total Team Net Sales <span style={{color:'var(--text-m)',fontWeight:300}}>(for manager commission)</span></label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input type="number" placeholder="0.00"
                value={revenueData?.teamNetSales || ''}
                onChange={e => onUpdateRevenue({ teamNetSales: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function TeamView({
  teamKey, staffList, periodDataMap, revenueData,
  onUpdatePeriodData, onTogglePaid, onUpdateRevenue,
  onEditStaff, onAddStaff
}) {
  const cfg = TEAM_CONFIG[teamKey];
  const members = staffList.filter(s => s.team === teamKey);
  const total = teamTotal(staffList, teamKey, periodDataMap, revenueData);
  const paidCount = members.filter(s => periodDataMap?.[s.id]?.paid).length;

  const roleOrder = { manager: 0, cofounder: 0, team_lead: 1, model_scout: 1, internal_admin: 1, regular: 2, reduced: 3 };
  const sorted = [...members].sort((a, b) => (roleOrder[a.role] ?? 9) - (roleOrder[b.role] ?? 9));

  return (
    <div className="team-view">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-team-dot" style={{ background: cfg.color }} />
          <div>
            <h1>{cfg.label}</h1>
            {cfg.platform && <p className="page-subtitle">{cfg.platform} Platform</p>}
          </div>
        </div>
        <div className="page-header-right">
          <div className="team-total-box" style={{ borderColor: cfg.color }}>
            <span className="team-total-label">Team Total</span>
            <span className="team-total-amount">{formatCurrency(total)}</span>
          </div>
          <div className="team-paid-status">{paidCount}/{members.length} paid</div>
        </div>
      </div>

      <RevenueInputs teamKey={teamKey} revenueData={revenueData} onUpdateRevenue={onUpdateRevenue} />

      <div className="team-table-wrap">
        <table className="team-table">
          <thead>
            <tr>
              <th className="th-name">Name</th>
              <th className="th-hours">Hours</th>
              <th className="th-sales">Net Sales</th>
              <th className="th-pay">Pay</th>
              <th className="th-action" style={{width:72}}>+  Paid</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(staff => (
              <StaffRow
                key={staff.id}
                staff={staff}
                periodData={periodDataMap?.[staff.id]}
                revenueData={revenueData}
                onUpdatePeriodData={onUpdatePeriodData}
                onTogglePaid={onTogglePaid}
              />
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="3">Team Total ({members.length} members)</td>
              <td className="cell-pay">
                <div className="pay-amount total-amount">{formatCurrency(total)}</div>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button className="btn-add-member" onClick={() => onAddStaff(teamKey)}>
        + Add Team Member
      </button>
    </div>
  );
}
