// Default staff roster for Gosian Media
// Compensation types:
//   hourly_commission: $/hr + % commission on individual net sales (bi-weekly)
//   manager: base pay bi-weekly + % of team total net sales (monthly, paid 7th)
//   team_lead_hourly_commission: $/hr + % commission (bi-weekly), same calc as hourly_commission
//   terminated_hourly: $/hr only, no commission (bi-weekly)
//   sliding_scale: Elijah's rev share model on SP + % of OF/Fansly gross
//   model_scout: % of net revenue from models brought on
//   internal_admin: % gross per platform
//   va_regular: flat monthly + $/hr (bi-weekly)
//   va_lead: flat monthly only

let _id = 1;
const id = () => `staff-${_id++}`;

export const DEFAULT_STAFF = [
  // ═══════════════════════════════════════
  // OF CHATTING TEAM
  // ═══════════════════════════════════════
  { id: id(), name: 'Sam', team: 'OF', role: 'manager', wiseHandle: '',
    comp: { type: 'manager', basePay: 200, commissionRate: 2 } },
  { id: id(), name: 'Arikky', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Renyke', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Ena', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Kathy', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Jean', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Ash', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Danielle', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Mowana', team: 'OF', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },

  // ═══════════════════════════════════════
  // SP CHATTING TEAM
  // ═══════════════════════════════════════
  { id: id(), name: 'Belle', team: 'SP', role: 'team_lead', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 4, commissionRate: 3 } },
  { id: id(), name: 'Elmer', team: 'SP', role: 'team_lead', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 4, commissionRate: 3 } },
  { id: id(), name: 'Mishka', team: 'SP', role: 'team_lead', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 4, commissionRate: 3 } },
  { id: id(), name: 'Yani', team: 'SP', role: 'team_lead', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 4, commissionRate: 3 } },
  { id: id(), name: 'Anne', team: 'SP', role: 'team_lead', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 4, commissionRate: 3 } },
  { id: id(), name: 'Alvin', team: 'SP', role: 'team_lead', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 4, commissionRate: 3 } },
  { id: id(), name: 'Ez', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Ren Dave', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Paj', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Kristine', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Russel', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Nikki', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'TJ', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Siah', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Gabrielle', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'John', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Sai', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Mia', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Xyza', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Sher', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Dayna', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Jasper', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Rache', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Lexxx', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Dale', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Enrick', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Ruth', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Macky', team: 'SP', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },

  // ═══════════════════════════════════════
  // FANSLY CHATTING TEAM
  // ═══════════════════════════════════════
  { id: id(), name: 'Patricia', team: 'Fansly', role: 'manager', wiseHandle: '',
    comp: { type: 'manager', basePay: 125, commissionRate: 2 } },
  { id: id(), name: 'Belle', team: 'Fansly', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Raymoned', team: 'Fansly', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Kazuya', team: 'Fansly', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Tori', team: 'Fansly', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Reyn', team: 'Fansly', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Bashir', team: 'Fansly', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Laken', team: 'Fansly', role: 'regular', wiseHandle: '',
    comp: { type: 'hourly_commission', hourlyRate: 3, commissionRate: 3 } },
  { id: id(), name: 'Joshua Attah', team: 'Fansly', role: 'reduced', wiseHandle: '',
    comp: { type: 'terminated_hourly', hourlyRate: 2 } },
  { id: id(), name: 'Johnmark', team: 'Fansly', role: 'reduced', wiseHandle: '',
    comp: { type: 'terminated_hourly', hourlyRate: 2 } },
  { id: id(), name: 'Lateef', team: 'Fansly', role: 'reduced', wiseHandle: '',
    comp: { type: 'terminated_hourly', hourlyRate: 2 } },

  // ═══════════════════════════════════════
  // ADMIN EXPENSES
  // ═══════════════════════════════════════
  { id: id(), name: 'Elijah', team: 'Admin', role: 'cofounder', wiseHandle: '',
    comp: {
      type: 'sliding_scale',
      // Sliding scale on SP monthly revenue
      tiers: [
        { maxRevenue: 150000, rate: 21.25 },
        { maxRevenue: 200000, rate: 20 },
        { maxRevenue: 250000, rate: 19 },
        { maxRevenue: Infinity, rate: 18 },
      ],
      // Additional: 5% of OF/Fansly gross for outreach work
      ofFanslyGrossRate: 5,
    }},
  { id: id(), name: 'Kevin', team: 'Admin', role: 'model_scout', wiseHandle: '',
    comp: { type: 'model_scout', commissionRate: 10 } },
  { id: id(), name: 'Casey', team: 'Admin', role: 'internal_admin', wiseHandle: '',
    comp: { type: 'internal_admin', spGrossRate: 2.5, fanslyGrossRate: 5 } },

  // ═══════════════════════════════════════
  // VA TEAM
  // ═══════════════════════════════════════
  { id: id(), name: 'Yani', team: 'VA', role: 'team_lead', wiseHandle: '',
    comp: { type: 'va_lead', monthlyFlat: 300 } },
  { id: id(), name: 'Charles', team: 'VA', role: 'regular', wiseHandle: '',
    comp: { type: 'va_regular', monthlyFlat: 150, hourlyRate: 2 } },
  { id: id(), name: 'Gel', team: 'VA', role: 'regular', wiseHandle: '',
    comp: { type: 'va_regular', monthlyFlat: 150, hourlyRate: 2 } },
  { id: id(), name: 'Lyn', team: 'VA', role: 'regular', wiseHandle: '',
    comp: { type: 'va_regular', monthlyFlat: 150, hourlyRate: 2 } },
  { id: id(), name: 'Chris', team: 'VA', role: 'regular', wiseHandle: '',
    comp: { type: 'va_regular', monthlyFlat: 150, hourlyRate: 2 } },
  { id: id(), name: 'Meiji', team: 'VA', role: 'regular', wiseHandle: '',
    comp: { type: 'va_regular', monthlyFlat: 150, hourlyRate: 2 } },
  { id: id(), name: 'Hex', team: 'VA', role: 'regular', wiseHandle: '',
    comp: { type: 'va_regular', monthlyFlat: 150, hourlyRate: 2 } },
];

export const TEAM_CONFIG = {
  OF: {
    key: 'OF',
    label: 'OF Chatting Team',
    platform: 'OnlyFans',
    color: '#00aff0',
    icon: 'OF',
    type: 'chatter',
  },
  SP: {
    key: 'SP',
    label: 'SP Chatting Team',
    platform: 'SextPanther',
    color: '#ff7043',
    icon: 'SP',
    type: 'chatter',
  },
  Fansly: {
    key: 'Fansly',
    label: 'Fansly Chatting Team',
    platform: 'Fansly',
    color: '#e040fb',
    icon: 'FN',
    type: 'chatter',
  },
  Admin: {
    key: 'Admin',
    label: 'Admin Expenses',
    platform: null,
    color: '#a78bfa',
    icon: 'AD',
    type: 'admin',
  },
  VA: {
    key: 'VA',
    label: 'VA Team',
    platform: null,
    color: '#60a5fa',
    icon: 'VA',
    type: 'staff',
  },
};

export const TEAM_ORDER = ['OF', 'SP', 'Fansly', 'Admin', 'VA'];

export const ROLE_DISPLAY = {
  manager: 'Manager',
  team_lead: 'Team Lead',
  regular: '',
  reduced: 'Reduced',
  cofounder: 'Co-Founder',
  model_scout: 'Model Scout',
  internal_admin: 'Internal Admin',
};

// Pay schedule
export const PAY_SCHEDULE = {
  invoiceDates: [1, 16],  // Send invoices on 1st and 16th
  payDates: [7, 23],      // Pay team on 7th and 23rd
  // Period 1: 1st - 15th → invoiced on 16th → paid on 23rd
  // Period 2: 16th - end of month → invoiced on 1st → paid on 7th
};
