import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Row } from '../types';

interface Props {
  rows: Row[];
}

interface Card {
  label: string;
  value: number | string;
  color: string;
}

export const SummaryCards: React.FC<Props> = ({ rows }) => {
  const workingDays = rows.filter((r) => r.status === 'working').length;
  const totalHours = rows.reduce((sum, r) => sum + r.hours, 0);
  const nseHolidays = rows.filter((r) => r.status === 'holiday').length;
  const weekends = rows.filter((r) => r.status === 'weekend').length;

  const cards: Card[] = [
    { label: 'Working Days', value: workingDays, color: '#16a34a' },
    { label: 'Total Hours',  value: totalHours,  color: '#4f46e5' },
    { label: 'NSE Holidays', value: nseHolidays, color: '#d97706' },
    { label: 'Weekends',     value: weekends,     color: '#64748b' },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2.5 }}>
      {cards.map(({ label, value, color }) => (
        <Grid item xs={6} sm={3} key={label}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textAlign: 'left',
            }}
          >
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ color, fontWeight: 700, mt: 0.5, lineHeight: 1.2 }}>
              {value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
