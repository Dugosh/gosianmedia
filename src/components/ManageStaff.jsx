import React, { useState } from 'react';
import { TEAM_CONFIG, TEAM_ORDER, ROLE_DISPLAY } from '../data/defaultStaff';
import { getCompDescription, generateId } from '../utils/calculations';

const COMP_TEMPLATES = {
  hourly_commission: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 },
  team_lead_hourly:  { type: 'hourly_commission', hourlyRate: 4, commissionRate: 3 },
  manager_of:        { type: 'manager', basePay: 200, commissionRate: 2 },
  manager_fansly:    { type: 'manager', basePay: 125, commissionRate: 2 },
  terminated_hourly: { type: 'terminated_hourly', hourlyRate: 2 },
  va_regular:        { type: 'va_regular', monthlyFlat: 150, hourlyRate: 2 },
  va_lead:           { type: 'va_lead', monthlyFlat: 300 },
  sliding_scale:     { type: 'sliding_scale', tiers: [
    { maxRevenue: 150000, rate: 21.25 },
    { maxRevenue: 200000, rate: 20 },
    { maxRevenue: 250000, rate: 19 },
    { maxRevenue: Infinity, rate: 18 },
  ], ofFanslyGrossRate: 5 },
  model_scout:       { type: 'model_scout', commissionRate: 10 },
  internal_admin:    { type: 'internal_admin', spGrossRate: 2.5, fanslyGrossRate: 5 },
};

function AddStaffModal({ team, onAdd, onClose }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('regular');
  const [compType, setCompType] = useState('hourly_commission');
  const [hourlyRate, setHourlyRate] = useState(3);
  const [commRate, setCommRate] = useState(3);
  const [basePay, setBasePay] = useState(200);
  const [monthlyFlat, setMonthlyFlat] = useState(150);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    let comp;
    switch (compType) {
      case 'hourly_commission':
        comp = { type: 'hourly_commission', hourlyRate: Number(hourlyRate), commissionRate: Number(commRate) };
        break;
      case 'terminated_hourly':
        comp = { type: 'terminated_hourly', hourlyRate: Number(hourlyRate) };
        break;
      case 'manager':
        comp = { type: 'manager', basePay: Number(basePay), commissionRate: Number(commRate) };
        break;
      case 'va_regular':
        comp = { type: 'va_regular', monthlyFlat: Number(monthlyFlat), hourlyRate: Number(hourlyRate) };
        break;
      case 'va_lead':
        comp = { type: 'va_lead', monthlyFlat: Number(monthlyFlat) };
        break;
      default:
        comp = COMP_TEMPLATES[compType] || COMP_TEMPLATES.hourly_commission;
    }

    onAdd({
      id: generateId(),
      name: name.trim(),
      team,
      role,
      wiseHandle: '',
      comp,
    });
    onClose();
  };

  const teamCfg = TEAM_CONFIG[team];
  const isChatter = teamCfg?.type === 'chatter';
  const isVA = team === 'VA';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Member to {teamCfg?.label}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="Full name" />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="regular">Regular</option>
              <option value="team_lead">Team Lead</option>
              <option value="manager">Manager</option>
              <option value="reduced">Reduced Pay</option>
            </select>
          </div>
          <div className="form-group">
            <label>Compensation Type</label>
            <select value={compType} onChange={e => setCompType(e.target.value)}>
              {isChatter && <option value="hourly_commission">Hourly + Commission</option>}
              {isChatter && <option value="manager">Manager (Base + Team Commission)</option>}
              {isChatter && <option value="terminated_hourly">Hourly Only (No Commission)</option>}
              {isVA && <option value="va_regular">Monthly Flat + Hourly</option>}
              {isVA && <option value="va_lead">Monthly Flat Only</option>}
              {team === 'Admin' && <option value="hourly_commission">Hourly + Commission</option>}
              {team === 'Admin' && <option value="model_scout">Model Scout</option>}
              {team === 'Admin' && <option value="internal_admin">Internal Admin</option>}
            </select>
          </div>

          {(compType === 'hourly_commission' || compType === 'terminated_hourly' || compType === 'va_regular') && (
            <div className="form-group">
              <label>Hourly Rate ($)</label>
              <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} min="0" step="0.5" />
            </div>
          )}
          {(compType === 'hourly_commission' || compType === 'manager') && (
            <div className="form-group">
              <label>Commission Rate (%)</label>
              <input type="number" value={commRate} onChange={e => setCommRate(e.target.value)} min="0" step="0.5" />
            </div>
          )}
          {compType === 'manager' && (
            <div className="form-group">
              <label>Base Pay (bi-weekly) ($)</label>
              <input type="number" value={basePay} onChange={e => setBasePay(e.target.value)} min="0" />
            </div>
          )}
          {(compType === 'va_regular' || compType === 'va_lead') && (
            <div className="form-group">
              <label>Monthly Flat ($)</label>
              <input type="number" value={monthlyFlat} onChange={e => setMonthlyFlat(e.target.value)} min="0" />
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

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditWise(s.wiseHandle || '');
  };

  const saveEdit = (s) => {
    onUpdateStaff(s.id, { name: editName.trim() || s.name, wiseHandle: editWise });
    setEditingId(null);
  };

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
                      <input
                        className="manage-edit-input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="Name"
                      />
                      <input
                        className="manage-edit-input"
                        value={editWise}
                        onChange={e => setEditWise(e.target.value)}
                        placeholder="Wise/Payment handle"
                      />
                      <button className="btn-small btn-primary" onClick={() => saveEdit(s)}>Save</button>
                      <button className="btn-small btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="manage-name">{s.name}</span>
                      {ROLE_DISPLAY[s.role] && <span className={`role-chip role-${s.role}`}>{ROLE_DISPLAY[s.role]}</span>}
                      <span className="manage-comp">{getCompDescription(s.comp)}</span>
                      {s.wiseHandle && <span className="manage-wise">{s.wiseHandle}</span>}
                      <div className="manage-actions">
                        <button className="btn-icon" onClick={() => startEdit(s)} title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="btn-icon btn-danger-icon" onClick={() => onRemoveStaff(s.id)} title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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
