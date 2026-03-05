import { TEAM_CONFIG } from '../data/defaultStaff.js';

// ─── Format helpers ────────────────────────────────────────
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(amount);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── Pay period helpers ────────────────────────────────────
export function getPayPeriods(year, month) {
  const lastDay = new Date(year, month, 0).getDate();
  return [
    { label: `${month}/1 – ${month}/15`, start: 1, end: 15, payDate: 23, type: 'biweekly', periodIndex: 0 },
    { label: `${month}/16 – ${month}/${lastDay}`, start: 16, end: lastDay, payDate: 7, type: 'biweekly', periodIndex: 1 },
  ];
}

export function getMonthlyPeriod(year, month) {
  const lastDay = new Date(year, month, 0).getDate();
  return { label: `${month}/1 – ${month}/${lastDay} (Monthly)`, start: 1, end: lastDay, payDate: 7, type: 'monthly' };
}

// ─── Calculate individual staff pay ────────────────────────
export function calculateStaffPay(staff, periodData, revenueData) {
  const comp = staff.comp;
  if (!comp) return { total: 0, breakdown: {} };

  const pd = periodData || {};
  const bonus = parseFloat(pd.bonus) || 0;

  // Manual override takes precedence over all calculations
  if (pd.manualPay !== undefined && pd.manualPay !== '') {
    const manualAmount = parseFloat(pd.manualPay) || 0;
    return {
      total: manualAmount + bonus,
      breakdown: { isManual: true, manualAmount, bonus },
    };
  }

  const hours = parseFloat(pd.hoursWorked) || 0;
  const netSales = parseFloat(pd.netSales) || 0;

  let result;

  switch (comp.type) {
    case 'hourly_commission': {
      const hoursPay = hours * comp.hourlyRate;
      const commPay = netSales * (comp.commissionRate / 100);
      result = {
        total: hoursPay + commPay,
        breakdown: { hoursPay, commPay, hours, netSales, hourlyRate: comp.hourlyRate, commissionRate: comp.commissionRate },
      };
      break;
    }

    case 'manager': {
      const basePay = comp.basePay;
      const teamNetSales = parseFloat(revenueData?.teamNetSales) || 0;
      const commPay = teamNetSales * (comp.commissionRate / 100);
      result = {
        total: basePay + commPay,
        breakdown: { basePay, commPay, teamNetSales, commissionRate: comp.commissionRate },
      };
      break;
    }

    case 'terminated_hourly': {
      const hoursPay = hours * comp.hourlyRate;
      result = {
        total: hoursPay,
        breakdown: { hoursPay, hours, hourlyRate: comp.hourlyRate },
      };
      break;
    }

    case 'sliding_scale': {
      // Elijah: sliding scale % of SP Gross Revenue + flat % of OF + Fansly gross
      const spRevenue = parseFloat(revenueData?.spGrossRevenue) || 0;
      const ofGross = parseFloat(revenueData?.ofGrossRevenue) || 0;
      const fanslyGross = parseFloat(revenueData?.fanslyGrossRevenue) || 0;
      const outreachGross = ofGross + fanslyGross;

      let rate = comp.tiers[comp.tiers.length - 1].rate;
      for (const tier of comp.tiers) {
        if (spRevenue <= tier.maxRevenue) { rate = tier.rate; break; }
      }

      const spPay = spRevenue * (rate / 100);
      const outreachPay = outreachGross * (comp.ofFanslyGrossRate / 100);
      result = {
        total: spPay + outreachPay,
        breakdown: { spPay, outreachPay, spRevenue, outreachGross, rate, outreachRate: comp.ofFanslyGrossRate },
      };
      break;
    }

    case 'revenue_share': {
      // Simplified flat revenue share: configurable % per platform
      const spGross = parseFloat(revenueData?.spGrossRevenue) || 0;
      const ofGross = parseFloat(revenueData?.ofGrossRevenue) || 0;
      const fanslyGross = parseFloat(revenueData?.fanslyGrossRevenue) || 0;
      const spPay = spGross * ((comp.spGrossRate || 0) / 100);
      const ofPay = ofGross * ((comp.ofGrossRate || 0) / 100);
      const fanslyPay = fanslyGross * ((comp.fanslyGrossRate || 0) / 100);
      result = {
        total: spPay + ofPay + fanslyPay,
        breakdown: { spPay, ofPay, fanslyPay, spGross, ofGross, fanslyGross },
      };
      break;
    }

    case 'internal_admin': {
      // Casey: fixed % of SP gross + % of Fansly gross
      const spGross = parseFloat(revenueData?.spGrossRevenue) || 0;
      const fanslyGross = parseFloat(revenueData?.fanslyGrossRevenue) || 0;
      const spPay = spGross * (comp.spGrossRate / 100);
      const fanslyPay = fanslyGross * (comp.fanslyGrossRate / 100);
      result = {
        total: spPay + fanslyPay,
        breakdown: { spPay, fanslyPay, spGross, fanslyGross, spGrossRate: comp.spGrossRate, fanslyGrossRate: comp.fanslyGrossRate },
      };
      break;
    }

    case 'model_scout': {
      // Kevin: now expects manual override — auto-calc returns 0 as placeholder
      const modelsNetRevenue = parseFloat(revenueData?.modelsNetRevenue) || 0;
      const commPay = modelsNetRevenue * (comp.commissionRate / 100);
      result = {
        total: commPay,
        breakdown: { commPay, modelsNetRevenue, commissionRate: comp.commissionRate },
      };
      break;
    }

    case 'manual': {
      // Pure manual: always $0 until manualPay override is entered (handled above)
      result = { total: 0, breakdown: { isManual: true } };
      break;
    }

    case 'va_regular': {
      const monthlyPortion = comp.monthlyFlat / 2;
      const hoursPay = hours * comp.hourlyRate;
      result = {
        total: monthlyPortion + hoursPay,
        breakdown: { monthlyPortion, hoursPay, hours, hourlyRate: comp.hourlyRate, monthlyFlat: comp.monthlyFlat },
      };
      break;
    }

    case 'va_lead': {
      const monthlyPortion = comp.monthlyFlat / 2;
      result = {
        total: monthlyPortion,
        breakdown: { monthlyPortion, monthlyFlat: comp.monthlyFlat },
      };
      break;
    }

    default:
      result = { total: 0, breakdown: {} };
  }

  // Add bonus on top of calculated amount
  return {
    total: result.total + bonus,
    breakdown: bonus > 0 ? { ...result.breakdown, bonus } : result.breakdown,
  };
}

// ─── Aggregations ──────────────────────────────────────────
export function teamTotal(staffList, teamKey, periodDataMap, revenueData) {
  return staffList
    .filter(s => s.team === teamKey)
    .reduce((sum, s) => {
      const pd = periodDataMap?.[s.id] || {};
      return sum + calculateStaffPay(s, pd, revenueData).total;
    }, 0);
}

export function grandTotal(staffList, periodDataMap, revenueData) {
  return staffList.reduce((sum, s) => {
    const pd = periodDataMap?.[s.id] || {};
    return sum + calculateStaffPay(s, pd, revenueData).total;
  }, 0);
}

// ─── Comp type descriptions ────────────────────────────────
export function getCompDescription(comp) {
  if (!comp) return '';
  switch (comp.type) {
    case 'hourly_commission':
      return `$${comp.hourlyRate}/hr + ${comp.commissionRate}% commission`;
    case 'manager':
      return `$${comp.basePay} base + ${comp.commissionRate}% team sales`;
    case 'terminated_hourly':
      return `$${comp.hourlyRate}/hr (hourly only)`;
    case 'sliding_scale':
      return `Sliding scale SP revenue + ${comp.ofFanslyGrossRate}% OF/Fansly`;
    case 'revenue_share': {
      const parts = [];
      if (comp.spGrossRate)     parts.push(`${comp.spGrossRate}% SP`);
      if (comp.ofGrossRate)     parts.push(`${comp.ofGrossRate}% OF`);
      if (comp.fanslyGrossRate) parts.push(`${comp.fanslyGrossRate}% Fansly`);
      return `Revenue share: ${parts.join(' + ')}`;
    }
    case 'internal_admin':
      return `${comp.spGrossRate}% SP + ${comp.fanslyGrossRate}% Fansly gross`;
    case 'model_scout':
      return 'Manual pay (model scout)';
    case 'manual':
      return 'Manual pay';
    case 'va_regular':
      return `$${comp.monthlyFlat}/mo + $${comp.hourlyRate}/hr`;
    case 'va_lead':
      return `$${comp.monthlyFlat}/mo flat`;
    default:
      return '';
  }
}
