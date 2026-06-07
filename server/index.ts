import express from 'express';
import path from 'path';
import { z } from 'zod';
import { getHolidays, refreshHolidays } from './holidaysFetcher';
import { generateMonthData, exportToExcel, Row } from './generator';
import { sendMail } from './mailer';

const EmployeeSchema = z.object({
  number: z.string(),
  name:   z.string(),
  client: z.string(),
});

const RowSchema = z.object({
  date:         z.string(),
  day:          z.string(),
  status:       z.enum(['working', 'weekend', 'holiday', 'leave', 'half_day']),
  hours:        z.number(),
  comment:      z.string().nullable().optional(),
  holiday_name: z.string().nullable().optional(),
});

const ExportSchema = z.object({
  year:     z.number().int().min(2000).max(2100),
  month:    z.number().int().min(1).max(12),
  rows:     z.array(RowSchema),
  employee: EmployeeSchema,
});

const SmtpSchema = z.object({
  host:       z.string(),
  port:       z.number().int(),
  username:   z.string(),
  password:   z.string().min(1, 'App password not configured in Settings'),
  from_email: z.string(),
});

const SendSchema = z.object({
  year:     z.number().int().min(2000).max(2100),
  month:    z.number().int().min(1).max(12),
  rows:     z.array(RowSchema),
  employee: EmployeeSchema,
  to:       z.string(),
  cc:       z.string().optional().default(''),
  bcc:      z.string().optional().default(''),
  subject:  z.string(),
  body:     z.string().optional().default(''),
  smtp:     SmtpSchema,
});

const app = express();
const PORT = 3001;

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

// GET /api/generate
app.get('/api/generate', async (req, res) => {
  const year  = parseInt(req.query.year  as string) || new Date().getFullYear();
  const month = parseInt(req.query.month as string) || (new Date().getMonth() + 1);
  const includeHolidays = req.query.holidays !== 'false';

  let map: Record<string, string> = {};
  let source = 'none';

  if (includeHolidays) {
    const result = await getHolidays(year);
    map = result.map;
    source = result.source;
  }

  const rows = generateMonthData(year, month, includeHolidays, map);
  res.json({ rows, holidays_source: source });
});

// GET /api/holidays/:year
app.get('/api/holidays/:year', async (req, res) => {
  const year = parseInt(req.params.year);
  const { map, source } = await getHolidays(year);

  const holidays = Object.entries(map).map(([key, name]) => {
    const [y, m, d] = key.split('-').map(Number);
    return { date: `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, name };
  });

  res.json({ source, count: holidays.length, holidays });
});

// POST /api/holidays/:year/refresh
app.post('/api/holidays/:year/refresh', async (req, res) => {
  const year = parseInt(req.params.year);
  const { source, map } = await refreshHolidays(year);
  res.json({ source, count: Object.keys(map).length });
});

// POST /api/export
app.post('/api/export', async (req, res) => {
  const parsed = ExportSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ ok: false, error: parsed.error.issues[0].message }); return; }
  const { year, month, rows, employee } = parsed.data;
  const buf = await exportToExcel(rows, year, month, employee.number, employee.name, employee.client);
  const filename = `${employee.name} Timesheet ${MONTH_NAMES[month - 1]} ${year}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buf);
});

// POST /api/send
app.post('/api/send', async (req, res) => {
  const parsed = SendSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ ok: false, error: parsed.error.issues[0].message }); return; }
  const { year, month, rows, employee, to, cc, bcc, subject, body, smtp } = parsed.data;

  try {
    const buf = await exportToExcel(rows, year, month, employee.number, employee.name, employee.client);
    const filename = `${employee.name} Timesheet ${MONTH_NAMES[month - 1]} ${year}.xlsx`;

    const split = (s: string) => s ? s.split(',').map((x: string) => x.trim()).filter(Boolean) : [];
    const toList  = split(to);
    const ccList  = split(cc);
    const bccList = split(bcc);

    await sendMail(
      { host: smtp.host, port: smtp.port, user: smtp.username, password: smtp.password, from: smtp.from_email || smtp.username },
      toList, ccList, bccList, subject, body, buf, filename,
    );

    res.json({ ok: true });
  } catch (e: unknown) {
    res.status(500).json({ ok: false, error: e instanceof Error ? e.message : 'Send failed' });
  }
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
