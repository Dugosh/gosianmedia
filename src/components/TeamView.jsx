import React, { useState } from 'react';
import { TEAM_CONFIG, ROLE_DISPLAY } from '../data/defaultStaff';
import { calculateStaffPay, formatCurrency, getCompDescription, teamTotal } from '../utils/calculations';

function CompBreakdown({ comp, breakdown }) {
  if (!breakdown) return null;
  switch (comp.type) {
    case 'hourly_commission':
      return (
        <span className="pay-breakdown">
          {formatCurrency(breakdown.hoursPay)} hrs + {formatCurrency(breakdown.commPay)} comm
        </span>
      );
    case 'manager':
      return (
        <span className="pay-breakdown">
          {formatCurrency(breakdown.basePay)} base + {formatCurrency(breakdown.commPay)} comm
        </span>
      );
    case 'terminated_hourly':
      return <span className="pay-breakdown">{formatCurrency(breakdown.hoursPay)} hrs</span>;
    case 'va_regular':
      return (
        <span className="pay-breakdown">
          {formatCurrency(breakdown.monthlyPortion)} flat + {formatCurrency(breakdown.hoursPay)} hrs
        </span>
      );
    case 'va_lead':
      return <span className="pay-breakdown">{formatCurrency(breakdown.monthlyPortion)} flat</span>;
    case 'sliding_scale':
      return (
        <span className="pay-breakdown">
          {formatCurrency(breakdown.spPay)} SP ({breakdown.rate}%) + {formatCurrency(breakdown.outreachPay)} outreach
        </span>
      );
    case 'model_scout':
      return <span className="pay-breakdown">{formatCurrency(breakdown.commPay)} ({comp.commissionRate}%)</span>;
    case 'internal_admin':
      return (
        <span className="pay-breakdown">
          {formatCurrency(breakdown.spPay)} SP + {formatCurrency(breakdown.fanslyPay)} Fansly
        </span>
      );
    default:
      return null;
  }
}

function StaffRow({ staff, periodData, revenueData, onUpdatePeriodData, onTogglePaid }) {
  const comp = staff.comp;
  const pd = periodData || {};
  const { total, breakdown } = calculateStaffPay(staff, pd, revenueData);
  const isPaid = pd.paid || false;
  const needsHours = ['hourly_commission', 'terminated_hourly', 'va_regular'].includes(comp.type);
  const needsSales = comp.type === 'hourly_commission';
  const needsTeamSales = comp.type === 'manager';
  const isAdmin = ['sliding_scale', 'model_scout', 'internal_admin'].includes(comp.type);
  const isVaLead = comp.type === 'va_lead';
  const roleLabel = ROLE_DISPLAY[staff.role] || '';

  return (
    <tr className={`staff-row ${isPaid ? 'staff-row-paid' : ''}`}>
      <td className="cell-name">
        <div className="name-group">
          <span className="staff-name">{staff.name}</span>
          {roleLabel && <span className={`role-chip role-${staff.role}`}>{roleLabel}</span>}
        </div>
        <div className="comp-desc">{getCompDescription(comp)}</div>
      </td>

      {/* Hours input */}
      <td className="cell-input">
        {needsHours ? (
          <input
            type="number"
            className="inline-input"
            placeholder="0"
            value={pd.hoursWorked || ''}
            onChange={e => onUpdatePeriodData(staff.id, { hoursWorked: e.target.value })}
            min="0"
            step="0.5"
          />
        ) : (isAdmin || isVaLead || needsTeamSales) ? (
          <span className="cell-na">—</span>
        ) : null}
      </td>

      {/* Net Sales input */}
      <td className="cell-input">
        {needsSales ? (
          <div className="input-with-prefix">
            <span className="input-prefix">$</span>
            <input
              type="number"
              className="inline-input"
              placeholder="0.00"
              value={pd.netSales || ''}
              onChange={e => onUpdatePeriodData(staff.id, { netSales: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>
        ) : needsTeamSales ? (
          <span className="cell-hint">Uses team total</span>
        ) : (
          <span className="cell-na">—</span>
        )}
      </td>

      {/* Calculated Pay */}
      <td className="cell-pay">
        <div className="pay-amount">{formatCurrency(total)}</div>
        <CompBreakdown comp={comp} breakdown={breakdown} />
      </td>

      {/* Paid toggle */}
      <td className="cell-action">
        <button
          className={`paid-btn ${isPaid ? 'paid-btn-yes' : 'paid-btn-no'}`}
          onClick={() => onTogglePaid(staff.id)}
          title={isPaid ? 'Mark unpaid' : 'Mark paid'}
        >
          {isPaid ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
          )}
        </button>
      </td>
    </tr>
  );
}

function RevenueInputs({ teamKey, revenueData, onUpdateRevenue }) {
  if (teamKey === 'Admin') {
    return (
      <div className="revenue-inputs">
        <h4 className="revenue-title">Platform Revenue (for admin calculations)</h4>
        <div className="revenue-grid">
          <div className="revenue-field">
            <label>SP Monthly Revenue</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={revenueData?.spMonthlyRevenue || ''}
                onChange={e => onUpdateRevenue({ spMonthlyRevenue: e.target.value })}
              />
            </div>
          </div>
          <div className="revenue-field">
            <label>SP Gross Revenue</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={revenueData?.spGrossRevenue || ''}
                onChange={e => onUpdateRevenue({ spGrossRevenue: e.target.value })}
              />
            </div>
          </div>
          <div className="revenue-field">
            <label>OF/Fansly Gross Revenue</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={revenueData?.ofFanslyGross || ''}
                onChange={e => onUpdateRevenue({ ofFanslyGross: e.target.value })}
              />
            </div>
          </div>
          <div className="revenue-field">
            <label>Fansly Gross Revenue</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={revenueData?.fanslyGrossRevenue || ''}
                onChange={e => onUpdateRevenue({ fanslyGrossRevenue: e.target.value })}
              />
            </div>
          </div>
          <div className="revenue-field">
            <label>Kevin's Models Net Revenue</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={revenueData?.modelsNetRevenue || ''}
                onChange={e => onUpdateRevenue({ modelsNetRevenue: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For chatter teams with a manager, show team net sales input
  const hasManager = teamKey === 'OF' || teamKey === 'Fansly';
  if (hasManager) {
    return (
      <div className="revenue-inputs">
        <h4 className="revenue-title">Team Revenue</h4>
        <div className="revenue-grid">
          <div className="revenue-field">
            <label>Total Team Net Sales (for manager commission)</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={revenueData?.teamNetSales || ''}
                onChange={e => onUpdateRevenue({ teamNetSales: e.target.value })}
              />
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

  // Sort: managers/leads first, then regular, then reduced
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
          <div className="team-paid-status">
            {paidCount}/{members.length} paid
          </div>
        </div>
      </div>

      <RevenueInputs
        teamKey={teamKey}
        revenueData={revenueData}
        onUpdateRevenue={onUpdateRevenue}
      />

      <div className="team-table-wrap">
        <table className="team-table">
          <thead>
            <tr>
              <th className="th-name">Name</th>
              <th className="th-hours">Hours</th>
              <th className="th-sales">Net Sales</th>
              <th className="th-pay">Pay</th>
              <th className="th-action">Paid</th>
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
