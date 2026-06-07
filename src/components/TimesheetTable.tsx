import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Row, Status } from '../types';
import { STATUS_CONFIG } from '../utils/statusConfig';
import { StatusChip } from './StatusChip';

interface Props {
  rows: Row[];
  onChange: (index: number, updated: Partial<Row>) => void;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });
}

export const TimesheetTable: React.FC<Props> = ({ rows, onChange }) => {
  const handleStatusChange = (index: number, status: Status) => {
    const cfg = STATUS_CONFIG[status];
    onChange(index, { status, hours: cfg.hours, comment: cfg.comment });
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={{ background: '#f8fafc' }}>
            {['Date', 'Status', 'Hours', 'Comments'].map((h) => (
              <TableCell
                key={h}
                sx={{
                  background: '#f8fafc',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e2e8f0',
                  py: 1.25,
                  ...(h === 'Hours' && { width: 80 }),
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            const rowBg = STATUS_CONFIG[row.status].rowBg;
            const isWeekend = row.status === 'weekend';

            return (
              <TableRow
                key={row.date}
                sx={{
                  background: rowBg,
                  '&:last-child td': { border: 0 },
                  '& td': { borderColor: '#e2e8f0' },
                }}
              >
                {/* Date cell */}
                <TableCell sx={{ py: 1, minWidth: 110, verticalAlign: 'middle' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>
                    {formatDate(row.date)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    {row.day}
                  </Typography>
                  {row.holiday_name && (
                    <Typography variant="caption" sx={{ color: '#d97706', display: 'block' }}>
                      {row.holiday_name}
                    </Typography>
                  )}
                </TableCell>

                {/* Status chip */}
                <TableCell sx={{ py: 1, verticalAlign: 'middle' }}>
                  <StatusChip status={row.status} onChange={(s) => handleStatusChange(i, s)} />
                </TableCell>

                {/* Hours */}
                <TableCell sx={{ py: 1, verticalAlign: 'middle', width: 80 }}>
                  <TextField
                    type="number"
                    value={row.hours}
                    disabled={isWeekend}
                    inputProps={{ min: 0, max: 24, step: 0.5 }}
                    onChange={(e) => onChange(i, { hours: parseFloat(e.target.value) || 0 })}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: 70,
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        borderRadius: '6px',
                        background: isWeekend ? 'transparent' : '#fff',
                        '& fieldset': { borderColor: isWeekend ? 'transparent' : '#e2e8f0' },
                        '&:hover fieldset': { borderColor: isWeekend ? 'transparent' : '#94a3b8' },
                      },
                      '& input': { py: '5px', px: '8px', textAlign: 'right', color: isWeekend ? '#94a3b8' : '#1e293b' },
                    }}
                  />
                </TableCell>

                {/* Comment */}
                <TableCell sx={{ py: 1, verticalAlign: 'middle' }}>
                  <TextField
                    value={row.comment ?? ''}
                    onChange={(e) => onChange(i, { comment: e.target.value || null })}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        borderRadius: '6px',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: '#e2e8f0' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 1 },
                      },
                      '& input': { py: '5px', px: '8px', color: '#475569' },
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
