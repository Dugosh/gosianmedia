/**
 * Calculate gross pay based on pay type.
 * - salaried: fixed monthly salary
 * - hourly: rate × hoursWorked
 * - daily: rate × daysWorked
 */
export function calculateGrossPay(staff) {
  const { payType, salary, hourlyRate, hoursWorked, dailyRate, daysWorked } = staff

  switch (payType) {
    case 'salaried':
      return parseFloat(salary) || 0
    case 'hourly':
      return (parseFloat(hourlyRate) || 0) * (parseFloat(hoursWorked) || 0)
    case 'daily':
      return (parseFloat(dailyRate) || 0) * (parseFloat(daysWorked) || 0)
    default:
      return 0
  }
}

/**
 * Calculate net pay after deductions.
 */
export function calculateNetPay(grossPay, deductions) {
  const total = Object.values(deductions).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
  return Math.max(0, grossPay - total)
}

/**
 * Format a number as Nigerian Naira currency.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Generate a unique ID.
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
