export type HolidayMap = Record<string, string>; // 'YYYY-M-D' -> name
export type HolidaySource = 'nse' | 'cache' | 'builtin' | 'none';

// Confirmed 2026 NSE trading holidays
export const BUILTIN_HOLIDAYS_2026: HolidayMap = {
  '2026-1-15':  'Municipal Corporation Election (Maharashtra)',
  '2026-1-26':  'Republic Day',
  '2026-3-3':   'Holi',
  '2026-3-26':  'Shri Ram Navami',
  '2026-3-31':  'Shri Mahavir Jayanti',
  '2026-4-3':   'Good Friday',
  '2026-4-14':  'Dr. Baba Saheb Ambedkar Jayanti',
  '2026-5-1':   'Maharashtra Day',
  '2026-5-28':  'Bakri Id',
  '2026-6-26':  'Muharram',
  '2026-9-14':  'Ganesh Chaturthi',
  '2026-10-2':  'Mahatma Gandhi Jayanti',
  '2026-10-20': 'Dussehra',
  '2026-11-10': 'Diwali-Balipratipada',
  '2026-11-24': 'Prakash Gurpurb Sri Guru Nanak Dev',
  '2026-12-25': 'Christmas',
};
