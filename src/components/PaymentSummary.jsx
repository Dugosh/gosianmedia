import { calculateGrossPay, formatCurrency } from '../utils/calculations'

export default function PaymentSummary({ staffList, period }) {
  if (staffList.length === 0) return null

  const rows = staffList.map(s => {
    const gross = calculateGrossPay(s)
    return { ...s, gross }
  })

  const totalGross = rows.reduce((sum, r) => sum + r.gross, 0)

  function handlePrint() {
    window.print()
  }

  return (
    <div className="card" id="payment-summary">
      <div className="summary-header">
        <div>
          <h2 className="card-title">Payment Summary</h2>
          {period && <p className="muted">Period: {period}</p>}
        </div>
        <button className="btn btn-secondary no-print" onClick={handlePrint}>
          🖨 Print / Save PDF
        </button>
      </div>

      {/* Company header for print */}
      <div className="print-only company-header">
        <h1>Gosian Media</h1>
        <p>Staff Payment Report — {period || 'Current Period'}</p>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="muted">{i + 1}</td>
                <td className="bold">{r.name}</td>
                <td>{r.role}</td>
                <td className="muted">{r.department || '—'}</td>
                <td>
                  <span className={`badge badge-${r.payType}`}>
                    {r.payType === 'salaried' ? 'Salary' : r.payType === 'hourly' ? 'Hourly' : 'Daily'}
                  </span>
                </td>
                <td className="amount">{formatCurrency(r.gross)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan={5} className="bold">Total Payroll</td>
              <td className="amount bold">{formatCurrency(totalGross)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <span className="stat-label">Total Staff</span>
          <span className="stat-value">{staffList.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Payroll</span>
          <span className="stat-value highlight">{formatCurrency(totalGross)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Pay</span>
          <span className="stat-value">
            {formatCurrency(staffList.length ? totalGross / staffList.length : 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
