import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { Row } from '../types';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MON_ABBR  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatExcelDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayName = DAY_NAMES[date.getUTCDay()];
  const dd  = String(d).padStart(2, '0');
  const mon = MON_ABBR[m - 1];
  return `${dayName} ${dd}/${mon}/${y}`;
}

interface Props {
  year: number;
  month: number;
  rows: Row[];
  empNumber: string;
  empName: string;
  client: string;
  onDownload: () => void;
  onClose: () => void;
}

const HEADERS = ['Employee Number', 'Employee Name', 'Client Name', 'Date', 'Total Hours', 'Comments'];
const COL_WIDTHS = [120, 200, 140, 220, 100, 140];

export const PreviewModal: React.FC<Props> = ({
  year, month, rows, empNumber, empName, client, onDownload, onClose,
}) => {
  const monthName   = MONTH_NAMES[month - 1];
  const daysInMonth = new Date(year, month, 0).getDate();
  const startStr    = `01-${monthName.slice(0, 3)}-${year}`;
  const endStr      = `${String(daysInMonth).padStart(2, '0')}-${monthName.slice(0, 3)}-${year}`;
  const sheetTitle  = `Employees Timesheet Entries  ${startStr} - ${endStr}`;

  const cell = (extra = {}): React.CSSProperties => ({
    fontSize: '12px',
    padding: '3px 8px',
    border: '1px solid #c8c8c8',
    fontFamily: 'Calibri, Arial, sans-serif',
    whiteSpace: 'nowrap',
    ...extra,
  });

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px', maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Preview — {monthName} {year}
        </Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(90vh - 140px)', px: 2, pb: 1 }}>
          <Table
            size="small"
            sx={{
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              minWidth: 920,
              mt: 1,
              '& td, & th': { boxSizing: 'border-box' },
            }}
          >
            <TableBody>
              {/* Row 1 – Recro (grey fill, bold, centered) */}
              <TableRow>
                <TableCell colSpan={6} style={cell({ fontWeight: 700, background: '#D3D3D3', textAlign: 'center' })}>
                  Recro
                </TableCell>
              </TableRow>

              {/* Row 2 – Title (bold, centered) */}
              <TableRow>
                <TableCell colSpan={6} style={cell({ fontWeight: 700, textAlign: 'center' })}>
                  {sheetTitle}
                </TableCell>
              </TableRow>

              {/* Row 3 – Column headers (bold, light grey bg) */}
              <TableRow>
                {HEADERS.map((h, i) => (
                  <TableCell key={h} style={{ ...cell({ fontWeight: 700, background: '#f0f0f0', width: COL_WIDTHS[i] }) }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>

              {/* Data rows */}
              {rows.map((row) => (
                <TableRow
                  key={row.date}
                  sx={{ '&:hover': { background: '#fafafa' } }}
                >
                  <TableCell style={cell()}>{empNumber}</TableCell>
                  <TableCell style={cell()}>{empName}</TableCell>
                  <TableCell style={cell()}>{client}</TableCell>
                  <TableCell style={cell()}>{formatExcelDate(row.date)}</TableCell>
                  <TableCell style={cell({ textAlign: 'right' })}>
                    {row.hours === 0 ? 0 : row.hours}
                  </TableCell>
                  <TableCell style={cell({ color: row.comment ? '#1e293b' : '#94a3b8' })}>
                    {row.comment ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderColor: '#e2e8f0', color: '#475569', textTransform: 'none', borderRadius: '7px' }}
        >
          Close
        </Button>
        <Button
          onClick={() => { onDownload(); onClose(); }}
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ background: '#6366f1', textTransform: 'none', borderRadius: '7px', '&:hover': { background: '#4f46e5' } }}
        >
          Download .xlsx
        </Button>
      </DialogActions>
    </Dialog>
  );
};
