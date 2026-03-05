import React, { useState } from 'react';
import { TEAM_CONFIG, TEAM_ORDER, ROLE_DISPLAY } from '../data/defaultStaff';
import { getCompDescription, generateId } from '../utils/calculations';

// ─── Compensation type definitions shown to the user ──────
const COMP_TYPE_OPTIONS = [
  {
    value: 'hourly_commission',
    label: 'Hourly + Commission',
    desc: 'Paid per hour worked plus % of personal net sales',
    teams: ['OF', 'SP', 'Fansly', 'Admin', 'VA'],
  },
  {
    value: 'revenue_share',
    label: 'Revenue Share',
    desc: '% of platform gross revenue (SP, OF, Fansly)',
    teams: ['Admin'],
  },
  {
    value: 'manager',
    label: 'Base + Team Commission',
    desc: 'Fixed bi-weekly base pay plus % of total team net sales',
    teams: ['OF', 'SP', 'Fansly', 'Admin'],
  },
  {
    value: 'hourly',
    label: 'Hourly Only',
    desc: 'Paid per hour worked — no commission',
    teams: ['OF', 'SP', 'Fansly', 'Admin', 'VA'],
  },
  {
    value: 'va_flat',
    label: 'Monthly Flat + Hourly',
    desc: 'Fixed monthly rate split bi-weekly plus hourly',
    teams: ['VA'],
  },
  {
    value: 'va_lead',
    label: 'Monthly Flat Only',
    desc: 'Fixed monthly amount split across bi-weekly periods',
    teams: ['VA'],
  },
  {
    value: 'manual',
    label: 'Manual Pay',
    desc: 'No auto-calculation — amount entered manually each pay period',
    teams: ['OF', 'SP', 'Fansly', 'Admin', 'VA'],
  },
];

function AddStaffModal({ team, onAdd, onClose }) {
  const teamCfg = TEAM_CONFIG[team];
  const isVA = team === 'VA';
  const isAdmin = team === 'Admin';

  // Default comp type based on team
  const defaultComp = isVA ? 'va_flat' : isAdmin ? 'revenue_share' : 'hourly_commission';

  const [name, setName]         = useState('');
  const [wise, setWise]         = useState('');
  const [role, setRole]         = useState('regular');
  const [compType, setCompType] = useState(defaultComp);

  // Hourly + Commission
  const [hourlyRate, setHourlyRate] = useState(3);
  const [commRate, setCommRate]     = useState(3);

  // Revenue Share
  const [spRate, setSpRate]         = useState(0);
  const [ofRate, setOfRate]         = useState(0);
  const [fanslyRate, setFanslyRate] = useState(0);

  // Base + Team Commission
  const [basePay, setBasePay]       = useState(200);
  const [teamCommRate, setTeamCommRate] = useState(2);

  // VA flat
  const [monthlyFlat, setMonthlyFlat] = useState(150);

  const availableTypes = COMP_TYPE_OPTIONS.filter(o => o.teams.includes(team));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    let comp;
    switch (compType) {
      case 'hourly_commission':
        comp = { type: 'hourly_commission', hourlyRate: Number(hourlyRate), commissionRate: Number(commRate) };
        break;
      case 'revenue_share':
        comp = {
          type: 'revenue_share',
          spGrossRate:     Number(spRate),
          ofGrossRate:     Number(ofRate),
          fanslyGrossRate: Number(fanslyRate),
        };
        break;
      case 'manager':
        comp = { type: 'manager', basePay: Number(basePay), commissionRate: Number(teamCommRate) };
        break;
      case 'hourly':
        comp = { type: 'terminated_hourly', hourlyRate: Number(hourlyRate) };
        break;
      case 'va_flat':
        comp = { type: 'va_regular', monthlyFlat: Number(monthlyFlat), hourlyRate: Number(hourlyRate) };
        break;
      case 'va_lead':
        comp = { type: 'va_lead', monthlyFlat: Number(monthlyFlat) };
        break;
      case 'manual':
        comp = { type: 'manual' };
        break;
      default:
        comp = { type: 'manual' };
    }

    onAdd({
      id: generateId(),
      name: name.trim(),
      team,
      role,
      wiseHandle: wise.trim(),
      comp,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add to {teamCfg?.label}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="Full name" />
          </div>

          {/* Wise Username */}
          <div className="form-group">
            <label>Wise Username</label>
            <input type="text" value={wise} onChange={e => setWise(e.target.value)} placeholder="@wisehandle" />
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="regular">Regular</option>
              <option value="team_lead">Team Lead</option>
              <option value="manager">Manager</option>
              <option value="reduced">Reduced Pay</option>
            </select>
          </div>

          {/* Compensation Type */}
          <div className="form-group">
            <label>Compensation Type</label>
            <div className="comp-type-grid">
              {availableTypes.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`comp-type-option ${compType === opt.value ? 'comp-type-selected' : ''}`}
                  onClick={() => setCompType(opt.value)}
                >
                  <span className="comp-type-label">{opt.label}</span>
                  <span className="comp-type-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Hourly rate (hourly_commission or hourly only or va_flat) */}
          {(compType === 'hourly_commission' || compType === 'hourly' || compType === 'va_flat') && (
            <div className="form-group form-group-inline">
              <label>Hourly Rate</label>
              <div className="input-with-prefix" style={{maxWidth:140}}>
                <span className="input-prefix">$</span>
                <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} min="0" step="0.5" />
              </div>
            </div>
          )}

          {/* ── Commission rate (hourly_commission) */}
          {compType === 'hourly_commission' && (
            <div className="form-group form-group-inline">
              <label>Commission Rate</label>
              <div className="input-with-prefix" style={{maxWidth:140}}>
                <input type="number" value={commRate} onChange={e => setCommRate(e.target.value)} min="0" step="0.5" />
                <span className="input-prefix" style={{left:'auto',right:9,pointerEvents:'none'}}>%</span>
              </div>
            </div>
          )}

          {/* ── Revenue Share rates */}
          {compType === 'revenue_share' && (
            <>
              <div className="form-group-section-label">Revenue Share Rates (leave 0 if not applicable)</div>
              <div className="form-group form-group-inline">
                <label>SP Gross Rate</label>
                <div className="input-with-prefix" style={{maxWidth:140}}>
                  <input type="number" value={spRate} onChange={e => setSpRate(e.target.value)} min="0" step="0.25" />
                  <span className="input-prefix" style={{left:'auto',right:9}}>%</span>
                </div>
              </div>
              <div className="form-group form-group-inline">
                <label>OF Gross Rate</label>
                <div className="input-with-prefix" style={{maxWidth:140}}>
                  <input type="number" value={ofRate} onChange={e => setOfRate(e.target.value)} min="0" step="0.25" />
                  <span className="input-prefix" style={{left:'auto',right:9}}>%</span>
                </div>
              </div>
              <div className="form-group form-group-inline">
                <label>Fansly Gross Rate</label>
                <div className="input-with-prefix" style={{maxWidth:140}}>
                  <input type="number" value={fanslyRate} onChange={e => setFanslyRate(e.target.value)} min="0" step="0.25" />
                  <span className="input-prefix" style={{left:'auto',right:9}}>%</span>
                </div>
              </div>
            </>
          )}

          {/* ── Manager: base + team comm */}
          {compType === 'manager' && (
            <>
              <div className="form-group form-group-inline">
                <label>Base Pay (bi-weekly)</label>
                <div className="input-with-prefix" style={{maxWidth:140}}>
                  <span className="input-prefix">$</span>
                  <input type="number" value={basePay} onChange={e => setBasePay(e.target.value)} min="0" />
                </div>
              </div>
              <div className="form-group form-group-inline">
                <label>Team Commission Rate</label>
                <div className="input-with-prefix" style={{maxWidth:140}}>
                  <input type="number" value={teamCommRate} onChange={e => setTeamCommRate(e.target.value)} min="0" step="0.5" />
                  <span className="input-prefix" style={{left:'auto',right:9}}>%</span>
                </div>
              </div>
            </>
          )}

          {/* ── VA flat */}
          {(compType === 'va_flat' || compType === 'va_lead') && (
            <div className="form-group form-group-inline">
              <label>Monthly Flat</label>
              <div className="input-with-prefix" style={{maxWidth:140}}>
                <span className="input-prefix">$</span>
                <input type="number" value={monthlyFlat} onChange={e => setMonthlyFlat(e.target.value)} min="0" />
              </div>
            </div>
          )}

          {/* Manual pay notice */}
          {compType === 'manual' && (
            <div className="manual-pay-notice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Pay amount will be entered manually each pay period using the override field in the team view.
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Member</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageStaff({ staffList, onUpdateStaff, onRemoveStaff, onAddStaff }) {
  const [addingToTeam, setAddingToTeam] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editWise, setEditWise] = useState('');

  const startEdit = (s) => { setEditingId(s.id); setEditName(s.name); setEditWise(s.wiseHandle || ''); };
  const saveEdit  = (s) => { onUpdateStaff(s.id, { name: editName.trim() || s.name, wiseHandle: editWise }); setEditingId(null); };

  return (
    <div className="manage-staff">
      <div className="page-header">
        <h1>Manage Staff</h1>
        <p className="page-subtitle">Add, edit, or remove team members</p>
      </div>

      {TEAM_ORDER.map(tk => {
        const cfg = TEAM_CONFIG[tk];
        const members = staffList.filter(s => s.team === tk);
        const roleOrder = { manager: 0, cofounder: 0, team_lead: 1, model_scout: 1, internal_admin: 1, regular: 2, reduced: 3 };
        const sorted = [...members].sort((a, b) => (roleOrder[a.role] ?? 9) - (roleOrder[b.role] ?? 9));

        return (
          <div key={tk} className="manage-team-section">
            <div className="manage-team-header">
              <span className="team-card-dot" style={{ background: cfg.color }} />
              <span>{cfg.label}</span>
              <span className="nav-badge">{members.length}</span>
              <button className="btn-small btn-primary" onClick={() => setAddingToTeam(tk)}>+ Add</button>
            </div>
            <div className="manage-list">
              {sorted.map(s => (
                <div key={s.id} className="manage-row">
                  {editingId === s.id ? (
                    <>
                      <input className="manage-edit-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" />
                      <input className="manage-edit-input" value={editWise} onChange={e => setEditWise(e.target.value)} placeholder="@wise" />
                      <button className="btn-small btn-primary" onClick={() => saveEdit(s)}>Save</button>
                      <button className="btn-small btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="manage-name">{s.name}</span>
                      {ROLE_DISPLAY[s.role] && <span className={`role-chip role-${s.role}`}>{ROLE_DISPLAY[s.role]}</span>}
                      <span className="manage-comp">{getCompDescription(s.comp)}</span>
                      {s.wiseHandle && <span className="manage-wise">@{s.wiseHandle.replace(/^@/, '')}</span>}
                      <div className="manage-actions">
                        <button className="btn-icon" onClick={() => startEdit(s)} title="Edit name / Wise">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="btn-icon btn-danger-icon" onClick={() => onRemoveStaff(s.id)} title="Remove">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {addingToTeam && (
        <AddStaffModal
          team={addingToTeam}
          onAdd={(s) => { onAddStaff(s); setAddingToTeam(null); }}
          onClose={() => setAddingToTeam(null)}
        />
      )}
    </div>
  );
}
