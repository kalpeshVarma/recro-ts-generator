import React, { useState, useEffect, useCallback } from 'react';
import { Box, Alert, CircularProgress, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Row, Config, HolidaySource } from './types';
import { generateTimesheet, exportTimesheet, sendEmail, refreshHolidays } from './api';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TimesheetTable } from './components/TimesheetTable';
import { SettingsModal } from './components/SettingsModal';
import { SendModal } from './components/SendModal';
import { PreviewModal } from './components/PreviewModal';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const DEFAULT_CONFIG: Config = {
  employee: { number: '', name: '', client: '' },
  email: {
    smtp_host: 'smtp.zoho.in',
    smtp_port: 587,
    username: '',
    has_password: false,
    password: '',
    from_email: '',
    to: '',
    cc: '',
    bcc: '',
    subject_template: 'Timesheet {month} {year} - {name}',
  },
};

const theme = createTheme({
  typography: { fontFamily: 'Inter, sans-serif' },
  palette: { primary: { main: '#6366f1' }, background: { default: '#f1f5f9' } },
});

export default function App() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [rows, setRows] = useState<Row[]>([]);
  const [holidaysEnabled, setHolidaysEnabled] = useState(true);
  const [holidaySource, setHolidaySource] = useState<HolidaySource>('none');
  const [config, setConfig] = useState<Config>(() => {
    try {
      const saved = localStorage.getItem('timesheet_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });
  const [showSettings, setShowSettings] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('timesheet_config');
    } catch {
      return true;
    }
  });
  const [showSend, setShowSend] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (y: number, m: number, holidays: boolean) => {
    setLoading(true);
    setError('');
    try {
      const data = await generateTimesheet(y, m, holidays);
      setRows(data.rows);
      setHolidaySource(data.holidays_source);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate timesheet');
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(year, month, holidaysEnabled); }, [year, month, holidaysEnabled, load]);

  const handlePrev = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  };

  const handleNext = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  };

  const handleRowChange = (index: number, updated: Partial<Row>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...updated } : r)));

  const handleDownload = async () => {
    try {
      const blob = await exportTimesheet(year, month, rows, config.employee);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.employee.name} Timesheet ${MONTH_NAMES[month - 1]} ${year}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Download failed');
    }
  };

  const handleRefreshHolidays = async () => {
    try {
      await refreshHolidays(year);
      load(year, month, holidaysEnabled);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Refresh failed');
    }
  };

  const resolveSubject = () =>
    config.email.subject_template
      .replace('{month}', MONTH_NAMES[month - 1])
      .replace('{year}', String(year))
      .replace('{name}', config.employee.name);

  const handleSend = async (payload: { to: string; cc: string; bcc: string; subject: string; body: string }) => {
    await sendEmail({
      year, month, rows, employee: config.employee, ...payload,
      smtp: {
        host: config.email.smtp_host,
        port: config.email.smtp_port,
        username: config.email.username,
        password: config.email.password,
        from_email: config.email.from_email || config.email.username,
      },
    });
  };

  const handleSaveConfig = async (cfg: Config) => {
    const toStore = { ...cfg, email: { ...cfg.email, has_password: !!cfg.email.password } };
    localStorage.setItem('timesheet_config', JSON.stringify(toStore));
    setConfig(toStore);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: '#f1f5f9' }}>
        <Header
          year={year} month={month}
          onPrev={handlePrev} onNext={handleNext}
          holidaysEnabled={holidaysEnabled} onToggleHolidays={() => setHolidaysEnabled((h) => !h)}
          holidaySource={holidaySource} onRefreshHolidays={handleRefreshHolidays}
          hasRows={rows.length > 0}
          onPreview={() => setShowPreview(true)}
          onRegenerate={() => load(year, month, holidaysEnabled)}
          onSettings={() => setShowSettings(true)}
        />

        <Box component="main" sx={{ maxWidth: 960, mx: 'auto', px: 3, py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#6366f1' }} />
            </Box>
          )}

          {!loading && rows.length > 0 && (
            <>
              <SummaryCards rows={rows} />
              <TimesheetTable rows={rows} onChange={handleRowChange} />
            </>
          )}
        </Box>
      </Box>

      {showPreview && rows.length > 0 && (
        <PreviewModal
          year={year}
          month={month}
          rows={rows}
          empNumber={config.employee.number}
          empName={config.employee.name}
          client={config.employee.client}
          onDownload={handleDownload}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showSettings && (
        <SettingsModal config={config} onSave={handleSaveConfig} onClose={() => setShowSettings(false)} />
      )}

      {showSend && rows.length > 0 && (
        <SendModal
          defaultTo={config.email.to}
          defaultCc={config.email.cc}
          defaultBcc={config.email.bcc}
          defaultSubject={resolveSubject()}
          onSend={handleSend}
          onClose={() => setShowSend(false)}
        />
      )}
    </ThemeProvider>
  );
}
