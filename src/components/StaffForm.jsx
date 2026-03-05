import { useState } from 'react'
import { generateId } from '../utils/calculations'

const EMPTY_FORM = {
  name: '',
  role: '',
  department: '',
  payType: 'salaried',
  salary: '',
  hourlyRate: '',
  hoursWorked: '',
  dailyRate: '',
  daysWorked: '',
}

export default function StaffForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.role.trim()) e.role = 'Role is required'
    if (form.payType === 'salaried' && !form.salary) e.salary = 'Salary is required'
    if (form.payType === 'hourly' && (!form.hourlyRate || !form.hoursWorked))
      e.hourly = 'Rate and hours are required'
    if (form.payType === 'daily' && (!form.dailyRate || !form.daysWorked))
      e.daily = 'Rate and days are required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onAdd({ ...form, id: generateId() })
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="card">
      <h2 className="card-title">Add Staff Member</h2>
      <form onSubmit={handleSubmit} className="staff-form">
        {/* Basic info */}
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Adaeze Okonkwo"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Role / Position *</label>
            <input
              value={form.role}
              onChange={e => set('role', e.target.value)}
              placeholder="e.g. Video Editor"
            />
            {errors.role && <span className="error">{errors.role}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Department</label>
            <input
              value={form.department}
              onChange={e => set('department', e.target.value)}
              placeholder="e.g. Production"
            />
          </div>
          <div className="form-group">
            <label>Pay Type *</label>
            <select value={form.payType} onChange={e => set('payType', e.target.value)}>
              <option value="salaried">Monthly Salary</option>
              <option value="hourly">Hourly Rate</option>
              <option value="daily">Daily Rate</option>
            </select>
          </div>
        </div>

        {/* Pay-type-specific fields */}
        {form.payType === 'salaried' && (
          <div className="form-row">
            <div className="form-group">
              <label>Monthly Salary (₦) *</label>
              <input
                type="number"
                min="0"
                value={form.salary}
                onChange={e => set('salary', e.target.value)}
                placeholder="e.g. 150000"
              />
              {errors.salary && <span className="error">{errors.salary}</span>}
            </div>
          </div>
        )}

        {form.payType === 'hourly' && (
          <div className="form-row">
            <div className="form-group">
              <label>Hourly Rate (₦) *</label>
              <input
                type="number"
                min="0"
                value={form.hourlyRate}
                onChange={e => set('hourlyRate', e.target.value)}
                placeholder="e.g. 2500"
              />
            </div>
            <div className="form-group">
              <label>Hours Worked *</label>
              <input
                type="number"
                min="0"
                value={form.hoursWorked}
                onChange={e => set('hoursWorked', e.target.value)}
                placeholder="e.g. 160"
              />
            </div>
            {errors.hourly && <span className="error">{errors.hourly}</span>}
          </div>
        )}

        {form.payType === 'daily' && (
          <div className="form-row">
            <div className="form-group">
              <label>Daily Rate (₦) *</label>
              <input
                type="number"
                min="0"
                value={form.dailyRate}
                onChange={e => set('dailyRate', e.target.value)}
                placeholder="e.g. 10000"
              />
            </div>
            <div className="form-group">
              <label>Days Worked *</label>
              <input
                type="number"
                min="0"
                value={form.daysWorked}
                onChange={e => set('daysWorked', e.target.value)}
                placeholder="e.g. 22"
              />
            </div>
            {errors.daily && <span className="error">{errors.daily}</span>}
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          + Add Staff
        </button>
      </form>
    </div>
  )
}
