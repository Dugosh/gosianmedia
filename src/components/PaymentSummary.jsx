import React from 'react';
import { TEAM_CONFIG, TEAM_ORDER } from '../data/defaultStaff';
import { calculateStaffPay, formatCurrency, teamTotal, grandTotal } from '../utils/calculations';

export default function PaymentSummary({ staffList, periodDataMap, revenueData, payPeriodLabel }) {
  const gt = grandTotal(staffList, periodDataMap, revenueData);

  const handlePrint = () => window.print();

  return (
    <div className="pay-summary">
      <div className="page-header no-print">
        <div>
          <h1>Pay Summary</h1>
          <p className="page-subtitle">{payPeriodLabel}</p>
        </div>
        <button className="btn-primary" onClick={handlePrint}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 6}}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Export
        </button>
      </div>

      {/* Print header */}
      <div className="print-only print-header">
        <h1>GOSIAN MEDIA</h1>
        <h2>Staff Payment Summary</h2>
        <p>{payPeriodLabel}</p>
      </div>

      {/* Grand total card */}
      <div className="summary-grand">
        <div className="summary-grand-label">Total Payroll</div>
        <div className="summary-grand-amount">{formatCurrency(gt)}</div>
        <div className="summary-grand-teams">
          {TEAM_ORDER.map(tk => {
            const tt = teamTotal(staffList, tk, periodDataMap, revenueData);
            if (tt === 0 && staffList.filter(s => s.team === tk).length === 0) return null;
            return (
              <div key={tk} className="summary-team-chip">
                <span className="team-card-dot" style={{ background: TEAM_CONFIG[tk].color }} />
                <span>{TEAM_CONFIG[tk].label}</span>
                <span className="chip-amount">{formatCurrency(tt)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-team tables */}
      {TEAM_ORDER.map(tk => {
        const cfg = TEAM_CONFIG[tk];
        const members = staffList.filter(s => s.team === tk);
        if (members.length === 0) return null;
        const tt = teamTotal(staffList, tk, periodDataMap, revenueData);
        const roleOrder = { manager: 0, cofounder: 0, team_lead: 1, model_scout: 1, internal_admin: 1, regular: 2, reduced: 3 };
        const sorted = [...members].sort((a, b) => (roleOrder[a.role] ?? 9) - (roleOrder[b.role] ?? 9));

        return (
          <div key={tk} className="summary-section">
            <div className="summary-section-header">
              <span className="team-card-dot" style={{ background: cfg.color }} />
              <span>{cfg.label}</span>
              <span className="summary-section-total">{formatCurrency(tt)}</span>
            </div>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th className="text-right">Pay</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => {
                  const pd = periodDataMap?.[s.id] || {};
                  const { total } = calculateStaffPay(s, pd, revenueData);
                  const isPaid = pd.paid || false;
                  return (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td className="text-muted">{s.role === 'regular' ? '—' : s.role.replace(/_/g, ' ')}</td>
                      <td className="text-right">{formatCurrency(total)}</td>
                      <td className="text-center">
                        <span className={`status-pill ${isPaid ? 'status-paid' : 'status-unpaid'}`}>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>Subtotal</strong></td>
                  <td className="text-right"><strong>{formatCurrency(tt)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}
    </div>
  );
}
