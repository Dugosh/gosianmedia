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

  const hours = parseFloat(periodData?.hoursWorked) || 0;
  const netSales = parseFloat(periodData?.netSales) || 0;

  switch (comp.type) {
    case 'hourly_commission': {
      const hoursPay = hours * comp.hourlyRate;
      const commPay = netSales * (comp.commissionRate / 100);
      return {
        total: hoursPay + commPay,
        breakdown: { hoursPay, commPay, hours, netSales, hourlyRate: comp.hourlyRate, commissionRate: comp.commissionRate },
      };
    }

    case 'manager': {
      // Base pay is per bi-weekly period
      const basePay = comp.basePay;
      // Commission is on total team net sales, paid monthly
      // When calculating for a bi-weekly period, we show base only
      // Monthly commission is shown separately
      const teamNetSales = parseFloat(revenueData?.teamNetSales) || 0;
      const commPay = teamNetSales * (comp.commissionRate / 100);
      return {
        total: basePay + commPay,
        breakdown: { basePay, commPay, teamNetSales, commissionRate: comp.commissionRate },
      };
    }

    case 'terminated_hourly': {
      const hoursPay = hours * comp.hourlyRate;
      return {
        total: hoursPay,
        breakdown: { hoursPay, hours, hourlyRate: comp.hourlyRate },
      };
    }

    case 'sliding_scale': {
      const spRevenue = parseFloat(revenueData?.spMonthlyRevenue) || 0;
      const ofFanslyGross = parseFloat(revenueData?.ofFanslyGross) || 0;

      // Find the right tier
      let rate = comp.tiers[comp.tiers.length - 1].rate;
      for (const tier of comp.tiers) {
        if (spRevenue <= tier.maxRevenue) {
          rate = tier.rate;
          break;
        }
      }

      const spPay = spRevenue * (rate / 100);
      const outreachPay = ofFanslyGross * (comp.ofFanslyGrossRate / 100);
      return {
        total: spPay + outreachPay,
        breakdown: { spPay, outreachPay, spRevenue, ofFanslyGross, rate, outreachRate: comp.ofFanslyGrossRate },
      };
    }

    case 'model_scout': {
      const modelsNetRevenue = parseFloat(revenueData?.modelsNetRevenue) || 0;
      const commPay = modelsNetRevenue * (comp.commissionRate / 100);
      return {
        total: commPay,
        breakdown: { commPay, modelsNetRevenue, commissionRate: comp.commissionRate },
      };
    }

    case 'internal_admin': {
      const spGross = parseFloat(revenueData?.spGrossRevenue) || 0;
      const fanslyGross = parseFloat(revenueData?.fanslyGrossRevenue) || 0;
      const spPay = spGross * (comp.spGrossRate / 100);
      const fanslyPay = fanslyGross * (comp.fanslyGrossRate / 100);
      return {
        total: spPay + fanslyPay,
        breakdown: { spPay, fanslyPay, spGross, fanslyGross, spGrossRate: comp.spGrossRate, fanslyGrossRate: comp.fanslyGrossRate },
      };
    }

    case 'va_regular': {
      // Monthly flat is split across 2 bi-weekly periods
      const monthlyPortion = comp.monthlyFlat / 2;
      const hoursPay = hours * comp.hourlyRate;
      return {
        total: monthlyPortion + hoursPay,
        breakdown: { monthlyPortion, hoursPay, hours, hourlyRate: comp.hourlyRate, monthlyFlat: comp.monthlyFlat },
      };
    }

    case 'va_lead': {
      // Flat monthly, split across 2 bi-weekly periods
      const monthlyPortion = comp.monthlyFlat / 2;
      return {
        total: monthlyPortion,
        breakdown: { monthlyPortion, monthlyFlat: comp.monthlyFlat },
      };
    }

    default:
      return { total: 0, breakdown: {} };
  }
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
      return `$${comp.basePay} base (bi-weekly) + ${comp.commissionRate}% team net sales`;
    case 'terminated_hourly':
      return `$${comp.hourlyRate}/hr (no commission)`;
    case 'sliding_scale':
      return `Sliding scale on SP revenue + ${comp.ofFanslyGrossRate}% OF/Fansly gross`;
    case 'model_scout':
      return `${comp.commissionRate}% net revenue on signed models`;
    case 'internal_admin':
      return `${comp.spGrossRate}% SP gross + ${comp.fanslyGrossRate}% Fansly gross`;
    case 'va_regular':
      return `$${comp.monthlyFlat}/mo + $${comp.hourlyRate}/hr`;
    case 'va_lead':
      return `$${comp.monthlyFlat}/mo flat`;
    default:
      return '';
  }
}
