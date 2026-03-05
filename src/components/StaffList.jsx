import { calculateGrossPay, formatCurrency } from '../utils/calculations'

export default function StaffList({ staffList, onRemove }) {
  if (staffList.length === 0) {
    return (
      <div className="card empty-state">
        <p>No staff added yet. Use the form above to add staff members.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="card-title">Staff ({staffList.length})</h2>
      <div className="table-wrapper">
        <table className="staff-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Pay Type</th>
              <th>Gross Pay</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s, i) => {
              const gross = calculateGrossPay(s)
              return (
                <tr key={s.id}>
                  <td className="muted">{i + 1}</td>
                  <td className="bold">{s.name}</td>
                  <td>{s.role}</td>
                  <td className="muted">{s.department || '—'}</td>
                  <td>
                    <span className={`badge badge-${s.payType}`}>
                      {s.payType === 'salaried' ? 'Salary' : s.payType === 'hourly' ? 'Hourly' : 'Daily'}
                    </span>
                  </td>
                  <td className="amount">{formatCurrency(gross)}</td>
                  <td>
                    <button className="btn-icon" onClick={() => onRemove(s.id)} title="Remove">
                      ✕
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
