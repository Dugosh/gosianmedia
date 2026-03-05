import { useState } from 'react'
import {
  TEAMS, TEAM_ORDER, ROLE_LABELS,
  DEFAULT_HOURLY_RATE, DEFAULT_COMMISSION,
  isChatterTeam, calculatePay, formatCurrency,
} from '../utils/calculations'

const EMPTY_CHATTER = {
  hoursWorked:    '',
  netSales:       '',
  hourlyRate:     String(DEFAULT_HOURLY_RATE),
  commissionRate: String(DEFAULT_COMMISSION),
}

const EMPTY_STAFF = {
  name:        '',
  team:        'OF',
  roleLabel:   'Regular',
  wiseHandle:  '',
  notes:       '',
  paidStatus:  false,
  // chatter fields
  ...EMPTY_CHATTER,
  // va/admin fields
  payType:     'hourly',
  hourlyRate:  '',
  hoursWorked: '',
  salary:      '',
}

export default function StaffForm({ initialData, defaultTeam, onSave, onCancel }) {
  const isEditing = !!initialData

  const [form, setForm] = useState(() => {
    if (initialData) return { ...EMPTY_STAFF, ...initialData }
    if (defaultTeam)  return { ...EMPTY_STAFF, team: defaultTeam }
    return { ...EMPTY_STAFF }
  })

  const [errors, setErrors] = useState({})

  const isChatter = isChatterTeam(form.team)

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function setTeam(teamKey) {
    setForm(prev => ({
      ...prev,
      team: teamKey,
      // reset comp fields when switching team type
      ...(isChatterTeam(teamKey) !== isChatterTeam(prev.team) ? {
        hoursWorked: '', netSales: '', hourlyRate: '', commissionRate: '',
        payType: 'hourly', salary: '',
      } : {}),
      // apply chatter defaults when switching TO a chatter team
      ...(isChatterTeam(teamKey) ? {
        hourlyRate:     prev.hourlyRate     || String(DEFAULT_HOURLY_RATE),
        commissionRate: prev.commissionRate || String(DEFAULT_COMMISSION),
      } : {}),
    }))
    setErrors({})
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'

    if (isChatter) {
      if (!form.hoursWorked && !form.netSales) e.hoursWorked = 'Enter hours or net sales'
      if (!form.hourlyRate)     e.hourlyRate     = 'Required'
      if (!form.commissionRate) e.commissionRate = 'Required'
    } else {
      if (form.payType === 'hourly') {
        if (!form.hourlyRate)  e.hourlyRate  = 'Required'
        if (!form.hoursWorked) e.hoursWorked = 'Required'
      } else {
        if (!form.salary) e.salary = 'Required'
      }
    }
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSave(form)
  }

  // Live pay preview
  const previewPay = calculatePay(form)
  const teamConfig = TEAMS[form.team]

  // Hours pay + commission pay for chatter preview
  const previewHoursPay = isChatter
    ? (parseFloat(form.hoursWorked) || 0) * (parseFloat(form.hourlyRate) || 0)
    : 0
  const previewCommPay  = isChatter
    ? (parseFloat(form.netSales) || 0) * ((parseFloat(form.commissionRate) || 0) / 100)
    : 0

  return (
    <div className="form-card">
      <div className="form-title">
        {isEditing ? 'Edit Staff Member' : 'Add Staff Member'}
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── Identity ── */}
        <div className="form-section">
          <div className="form-section-label">Team Member Info</div>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span className="req">*</span></label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className={errors.name ? 'err' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Payment Handle <span className="muted" style={{fontSize:'.65rem',fontWeight:400}}>(Wise, CashApp, etc.)</span></label>
              <input
                value={form.wiseHandle}
                onChange={e => set('wiseHandle', e.target.value)}
                placeholder="e.g. @sarah_j or $sarahj"
              />
            </div>
          </div>
        </div>

        {/* ── Team ── */}
        <div className="form-section">
          <div className="form-section-label">Team <span className="req">*</span></div>
          <div className="team-selector">
            {TEAM_ORDER.map(key => (
              <button
                key={key}
                type="button"
                className={`team-btn team-${key} ${form.team === key ? 'team-btn-active' : ''}`}
                onClick={() => setTeam(key)}
              >
                {TEAMS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Role Label ── */}
        <div className="form-section">
          <div className="form-section-label">Role / Label</div>
          <div className="role-pill-group">
            {ROLE_LABELS.map(r => {
              const cls = r.toLowerCase().replace(/\s+/g, '')
              return (
                <button
                  key={r}
                  type="button"
                  className={`role-pill ${form.roleLabel === r ? `active-${cls}` : ''}`}
                  onClick={() => set('roleLabel', r)}
                >
                  {r}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Compensation ── */}
        <div className="form-section">
          <div className="form-section-label">
            Compensation — {teamConfig.platform ? teamConfig.platform : form.team}
          </div>

          {isChatter ? (
            <>
              <div className="form-row-4">
                <div className="form-group">
                  <label>Hours Worked</label>
                  <input
                    type="number" min="0" step="0.5"
                    value={form.hoursWorked}
                    onChange={e => set('hoursWorked', e.target.value)}
                    placeholder="0"
                    className={errors.hoursWorked ? 'err' : ''}
                  />
                  {errors.hoursWorked && <span className="error-msg">{errors.hoursWorked}</span>}
                </div>
                <div className="form-group">
                  <label>Net Sales</label>
                  <div className="input-wrap has-pfx">
                    <span className="pfx">$</span>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.netSales}
                      onChange={e => set('netSales', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hourly Rate <span className="req">*</span></label>
                  <div className="input-wrap has-pfx">
                    <span className="pfx">$</span>
                    <input
                      type="number" min="0" step="0.25"
                      value={form.hourlyRate}
                      onChange={e => set('hourlyRate', e.target.value)}
                      placeholder={String(DEFAULT_HOURLY_RATE)}
                      className={errors.hourlyRate ? 'err' : ''}
                    />
                  </div>
                  {errors.hourlyRate && <span className="error-msg">{errors.hourlyRate}</span>}
                </div>
                <div className="form-group">
                  <label>Commission % <span className="req">*</span></label>
                  <div className="input-wrap has-sfx">
                    <input
                      type="number" min="0" step="0.1" max="100"
                      value={form.commissionRate}
                      onChange={e => set('commissionRate', e.target.value)}
                      placeholder={String(DEFAULT_COMMISSION)}
                      className={errors.commissionRate ? 'err' : ''}
                    />
                    <span className="sfx">%</span>
                  </div>
                  {errors.commissionRate && <span className="error-msg">{errors.commissionRate}</span>}
                </div>
              </div>

              {/* Pay preview */}
              {previewPay > 0 && (
                <div className="comp-preview mt-12">
                  <div className="comp-preview-row">
                    <span>Hours pay ({form.hoursWorked || 0} hrs × ${form.hourlyRate || 0}/hr)</span>
                    <span>{formatCurrency(previewHoursPay)}</span>
                  </div>
                  <div className="comp-preview-row">
                    <span>Commission ({formatCurrency(parseFloat(form.netSales) || 0)} × {form.commissionRate || 0}%)</span>
                    <span>{formatCurrency(previewCommPay)}</span>
                  </div>
                  <div className="comp-preview-total">
                    <span>Estimated Pay</span>
                    <span>{formatCurrency(previewPay)}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="pay-type-toggle">
                <button
                  type="button"
                  className={`pay-type-btn ${form.payType === 'hourly' ? 'active' : ''}`}
                  onClick={() => set('payType', 'hourly')}
                >
                  Hourly
                </button>
                <button
                  type="button"
                  className={`pay-type-btn ${form.payType === 'salary' ? 'active' : ''}`}
                  onClick={() => set('payType', 'salary')}
                >
                  Monthly Salary
                </button>
              </div>

              {form.payType === 'hourly' ? (
                <div className="form-row">
                  <div className="form-group">
                    <label>Hourly Rate <span className="req">*</span></label>
                    <div className="input-wrap has-pfx">
                      <span className="pfx">$</span>
                      <input
                        type="number" min="0" step="0.25"
                        value={form.hourlyRate}
                        onChange={e => set('hourlyRate', e.target.value)}
                        placeholder="0.00"
                        className={errors.hourlyRate ? 'err' : ''}
                      />
                    </div>
                    {errors.hourlyRate && <span className="error-msg">{errors.hourlyRate}</span>}
                  </div>
                  <div className="form-group">
                    <label>Hours Worked <span className="req">*</span></label>
                    <input
                      type="number" min="0" step="0.5"
                      value={form.hoursWorked}
                      onChange={e => set('hoursWorked', e.target.value)}
                      placeholder="0"
                      className={errors.hoursWorked ? 'err' : ''}
                    />
                    {errors.hoursWorked && <span className="error-msg">{errors.hoursWorked}</span>}
                  </div>
                </div>
              ) : (
                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Salary <span className="req">*</span></label>
                    <div className="input-wrap has-pfx">
                      <span className="pfx">$</span>
                      <input
                        type="number" min="0" step="1"
                        value={form.salary}
                        onChange={e => set('salary', e.target.value)}
                        placeholder="0.00"
                        className={errors.salary ? 'err' : ''}
                      />
                    </div>
                    {errors.salary && <span className="error-msg">{errors.salary}</span>}
                  </div>
                </div>
              )}

              {previewPay > 0 && (
                <div className="comp-preview mt-12">
                  <div className="comp-preview-total">
                    <span>Estimated Pay</span>
                    <span>{formatCurrency(previewPay)}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Notes ── */}
        <div className="form-section">
          <div className="form-section-label">Notes <span className="muted" style={{fontSize:'.65rem',fontWeight:400,textTransform:'none'}}>(optional)</span></div>
          <div className="form-group">
            <textarea
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any notes about this person's pay or terms..."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="form-footer">
          <div className="form-est">
            {previewPay > 0 && <>Pay: <strong>{formatCurrency(previewPay)}</strong></>}
          </div>
          <div className="form-actions">
            {(isEditing || onCancel) && (
              <button type="button" className="btn btn-ghost" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : '+ Add Staff Member'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
