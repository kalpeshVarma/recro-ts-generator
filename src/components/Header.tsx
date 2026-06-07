import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { HolidaySource } from '../types';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const SOURCE_BADGE: Record<HolidaySource, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  nse:     { label: 'NSE live', color: 'success' },
  cache:   { label: 'Cached',   color: 'warning' },
  builtin: { label: 'Built-in', color: 'error' },
  none:    { label: 'Off',      color: 'default' },
};

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  holidaysEnabled: boolean;
  onToggleHolidays: () => void;
  holidaySource: HolidaySource;
  onRefreshHolidays: () => void;
  hasRows: boolean;
  onPreview: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  onSettings: () => void;
}

export const Header: React.FC<Props> = ({
  year, month, onPrev, onNext,
  holidaysEnabled, onToggleHolidays, holidaySource, onRefreshHolidays,
  hasRows, onPreview, onDownload, onRegenerate, onSettings,
}) => {
  const badge = SOURCE_BADGE[holidaySource];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ background: '#fff', borderBottom: '1px solid #e2e8f0', color: '#1e293b' }}
    >
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap', minHeight: '64px !important', py: 1 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mr: 1 }}>
          <Box sx={{
            width: 32, height: 32, background: '#6366f1', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '14px',
          }}>
            R
          </Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1e293b', whiteSpace: 'nowrap' }}>
            Timesheet Generator
          </Typography>
        </Box>

        {/* Month navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={onPrev} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
          <Typography variant="body1" fontWeight={600} sx={{ minWidth: 130, textAlign: 'center', color: '#1e293b' }}>
            {MONTH_NAMES[month - 1]} {year}
          </Typography>
          <IconButton size="small" onClick={onNext} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* NSE toggle + badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <FormControlLabel
            control={
              <Switch
                checked={holidaysEnabled}
                onChange={onToggleHolidays}
                size="small"
                sx={{ '& .MuiSwitch-thumb': { background: holidaysEnabled ? '#6366f1' : undefined } }}
              />
            }
            label={<Typography variant="body2" fontWeight={500} sx={{ color: '#475569' }}>NSE Holidays</Typography>}
            sx={{ m: 0 }}
          />
          <Chip label={badge.label} color={badge.color} size="small" sx={{ height: 22, fontSize: '11px', fontWeight: 600 }} />
          <Tooltip title="Force refresh holiday data">
            <IconButton size="small" onClick={onRefreshHolidays} sx={{ color: '#64748b' }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Action buttons */}
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={onRegenerate}
          variant="outlined"
          sx={{ borderColor: '#e2e8f0', color: '#475569', textTransform: 'none', borderRadius: '7px' }}
        >
          Regen
        </Button>

        <Button
          size="small"
          startIcon={<PreviewIcon />}
          onClick={onPreview}
          disabled={!hasRows}
          variant="outlined"
          sx={{ borderColor: '#e2e8f0', color: '#475569', textTransform: 'none', borderRadius: '7px' }}
        >
          Preview
        </Button>

        <Button
          size="small"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
          disabled={!hasRows}
          variant="contained"
          sx={{ background: '#6366f1', textTransform: 'none', borderRadius: '7px', '&:hover': { background: '#4f46e5' } }}
        >
          .xlsx
        </Button>

        <Tooltip title="Account">
          <IconButton size="small" onClick={onSettings} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <AccountCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
