import { EmployeeConfig, GenerateResponse, Row } from './types';

const BASE = '/api';

export async function generateTimesheet(year: number, month: number, holidays: boolean): Promise<GenerateResponse> {
  const res = await fetch(`${BASE}/generate?year=${year}&month=${month}&holidays=${holidays}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function refreshHolidays(year: number): Promise<{ source: string; count: number }> {
  const res = await fetch(`${BASE}/holidays/${year}/refresh`, { method: 'POST' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function exportTimesheet(year: number, month: number, rows: Row[], employee: EmployeeConfig): Promise<Blob> {
  const res = await fetch(`${BASE}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year, month, rows, employee }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

export async function sendEmail(payload: {
  year: number;
  month: number;
  rows: Row[];
  employee: EmployeeConfig;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  smtp: { host: string; port: number; username: string; password: string; from_email: string };
}): Promise<void> {
  const res = await fetch(`${BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Send failed');
}
