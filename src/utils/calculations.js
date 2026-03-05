export const TEAMS = {
  OF:     { label: 'OF Chatting Team',       platform: 'OnlyFans',    color: '#00aff0', type: 'chatter' },
  Fansly: { label: 'Fansly Chatting Team',   platform: 'Fansly',      color: '#9b6dff', type: 'chatter' },
  SP:     { label: 'SP Chatting Team',       platform: 'SextPanther', color: '#ff7043', type: 'chatter' },
  VA:     { label: 'VA Team',                platform: null,           color: '#60a5fa', type: 'staff' },
  Admin:  { label: 'Admin',                  platform: null,           color: '#a78bfa', type: 'staff' },
}

export const TEAM_ORDER = ['OF', 'Fansly', 'SP', 'VA', 'Admin']

export const ROLE_LABELS = ['Regular', 'Team Lead', 'Manager', 'Terminated']

export const DEFAULT_HOURLY_RATE = 3
export const DEFAULT_COMMISSION  = 3

export function isChatterTeam(teamKey) {
  return TEAMS[teamKey]?.type === 'chatter'
}

export function calculatePay(staff) {
  if (!staff.team || !TEAMS[staff.team]) return 0

  if (isChatterTeam(staff.team)) {
    const hours = parseFloat(staff.hoursWorked)    || 0
    const sales = parseFloat(staff.netSales)       || 0
    const rate  = parseFloat(staff.hourlyRate)     || 0
    const comm  = parseFloat(staff.commissionRate) || 0
    return hours * rate + sales * (comm / 100)
  }

  // VA / Admin
  if (staff.payType === 'hourly') {
    return (parseFloat(staff.hourlyRate) || 0) * (parseFloat(staff.hoursWorked) || 0)
  }
  return parseFloat(staff.salary) || 0
}

export function teamTotal(staffList, teamKey) {
  return staffList
    .filter(s => s.team === teamKey)
    .reduce((sum, s) => sum + calculatePay(s), 0)
}

export function grandTotal(staffList) {
  return staffList.reduce((sum, s) => sum + calculatePay(s), 0)
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
