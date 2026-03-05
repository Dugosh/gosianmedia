import React from 'react';
import { TEAM_CONFIG, TEAM_ORDER } from '../data/defaultStaff';
import { teamTotal, grandTotal, formatCurrency } from '../utils/calculations';

export default function Dashboard({ staffList, periodDataMap, revenueData, payPeriod, onNavigate }) {
  const gt = grandTotal(staffList, periodDataMap, revenueData);
  const unpaidCount = staffList.filter(s => !periodDataMap?.[s.id]?.paid).length;
  const paidCount = staffList.length - unpaidCount;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Overview of payroll for the current period</p>
      </div>

      {/* Summary cards */}
      <div className="dash-cards">
        <div className="dash-card dash-card-total">
          <div className="dash-card-label">Total Payroll</div>
          <div className="dash-card-value">{formatCurrency(gt)}</div>
          <div className="dash-card-sub">{staffList.length} team members</div>
        </div>
        <div className="dash-card dash-card-paid">
          <div className="dash-card-label">Paid</div>
          <div className="dash-card-value">{paidCount}</div>
          <div className="dash-card-sub">of {staffList.length} staff</div>
        </div>
        <div className="dash-card dash-card-unpaid">
          <div className="dash-card-label">Unpaid</div>
          <div className="dash-card-value">{unpaidCount}</div>
          <div className="dash-card-sub">remaining</div>
        </div>
      </div>

      {/* Pay schedule info */}
      <div className="dash-schedule">
        <h3>Pay Schedule</h3>
        <div className="schedule-grid">
          <div className="schedule-item">
            <div className="schedule-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div className="schedule-title">Invoices Sent</div>
              <div className="schedule-desc">1st &amp; 16th of each month</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <div className="schedule-title">Pay Dates</div>
              <div className="schedule-desc">7th &amp; 23rd of each month</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="schedule-title">Manager Commission</div>
              <div className="schedule-desc">Paid monthly on the 7th</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div>
              <div className="schedule-title">Chatters &amp; Leads</div>
              <div className="schedule-desc">Commission paid bi-weekly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team breakdown */}
      <div className="dash-teams">
        <h3>Team Breakdown</h3>
        <div className="team-cards">
          {TEAM_ORDER.map(tk => {
            const cfg = TEAM_CONFIG[tk];
            const members = staffList.filter(s => s.team === tk);
            const total = teamTotal(staffList, tk, periodDataMap, revenueData);
            const paidMembers = members.filter(s => periodDataMap?.[s.id]?.paid).length;

            return (
              <button key={tk} className="team-card" onClick={() => onNavigate(`team-${tk}`)}>
                <div className="team-card-header">
                  <span className="team-card-dot" style={{ background: cfg.color }} />
                  <span className="team-card-name">{cfg.label}</span>
                </div>
                <div className="team-card-total">{formatCurrency(total)}</div>
                <div className="team-card-meta">
                  <span>{members.length} members</span>
                  <span className="team-card-paid">{paidMembers}/{members.length} paid</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
