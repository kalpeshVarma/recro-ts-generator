import ExcelJS from 'exceljs';
import { HolidayMap } from './holidays';

export type Status =
  | 'working' | 'weekend' | 'holiday'
  | 'sick_leave' | 'casual_leave' | 'earned_leave'
  | 'half_day' | 'leave';

export interface Row {
  date: string;
  day: string;
  status: Status;
  hours: number;
  comment: string | null;
  holiday_name: string;
}

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export function generateMonthData(
  year: number,
  month: number,
  includeHolidays: boolean,
  holidaysMap: HolidayMap,
): Row[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const rows: Row[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    const isWeekend = dow === 0 || dow === 6;
    const holidayKey = `${year}-${month}-${d}`;
    const holidayName = holidaysMap[holidayKey] ?? '';
    const isHoliday = includeHolidays && !!holidayName && !isWeekend;

    let status: Status;
    let hours: number;
    let comment: string | null;

    if (isWeekend) {
      status = 'weekend'; hours = 0; comment = 'Week off';
    } else if (isHoliday) {
      status = 'holiday'; hours = 0; comment = 'Holiday';
    } else {
      status = 'working'; hours = 9; comment = null;
    }

    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    rows.push({ date: isoDate, day: DAY_NAMES[dow], status, hours, comment, holiday_name: holidayName });
  }

  return rows;
}

export async function exportToExcel(
  rows: Row[],
  year: number,
  month: number,
  empNumber: string,
  empName: string,
  client: string,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Timesheet');

  sheet.columns = [
    { width: 16.0  },  // A: Employee Number
    { width: 31.14 },  // B: Employee Name
    { width: 19.86 },  // C: Client Name
    { width: 28.43 },  // D: Date
    { width: 15.14 },  // E: Total Hours
    { width: 13.71 },  // F: Comments
  ];

  const monthName = MONTH_NAMES[month - 1];
  const daysInMonth = new Date(year, month, 0).getDate();
  const startStr = `01-${monthName.slice(0, 3)}-${year}`;
  const endStr   = `${String(daysInMonth).padStart(2, '0')}-${monthName.slice(0, 3)}-${year}`;

  // Row 1: company name — merged A1:F1, centered
  const r1 = sheet.addRow(['Recro']);
  sheet.mergeCells('A1:F1');
  r1.getCell(1).font      = { name: 'Calibri', bold: true };
  r1.getCell(1).fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
  r1.getCell(1).alignment = { horizontal: 'center' };

  // Row 2: title — merged A2:F2, centered
  const r2 = sheet.addRow([`Employees Timesheet Entries  ${startStr} - ${endStr}`]);
  sheet.mergeCells('A2:F2');
  r2.getCell(1).font      = { name: 'Calibri', bold: true };
  r2.getCell(1).alignment = { horizontal: 'center' };

  // Row 3: headers
  const r3 = sheet.addRow(['Employee Number', 'Employee Name', 'Client Name', 'Date', 'Total Hours', 'Comments']);
  r3.eachCell((cell) => { cell.font = { name: 'Calibri', bold: true }; });

  // Data rows
  for (const row of rows) {
    const [y, m, d] = row.date.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));

    const dataRow = sheet.addRow([
      empNumber,
      empName,
      client,
      dateObj,
      row.hours === 9 ? 9 : row.hours,
      row.comment ?? null,
    ]);

    dataRow.getCell(1).numFmt = '@';
    dataRow.getCell(3).numFmt = '@';
    dataRow.getCell(4).numFmt = 'dddd\\ dd/mmm/yyyy';
    dataRow.eachCell((cell) => { cell.font = { name: 'Calibri', bold: false }; });
  }

  const buf = await workbook.xlsx.writeBuffer();
  return Buffer.from(buf);
}
