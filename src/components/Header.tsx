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
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import SyncIcon from '@mui/icons-material/Sync';
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
  onRegenerate: () => void;
  onSettings: () => void;
}

export const Header: React.FC<Props> = ({
  year, month, onPrev, onNext,
  holidaysEnabled, onToggleHolidays, holidaySource, onRefreshHolidays,
  hasRows, onPreview, onRegenerate, onSettings,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const badge = SOURCE_BADGE[holidaySource];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ background: '#fff', borderBottom: '1px solid #e2e8f0', color: '#1e293b' }}
    >
      <Toolbar sx={{ gap: 1, minHeight: '56px !important', px: { xs: 1.5, sm: 3 } }}>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1, flexShrink: 0 }}>
          <Box sx={{
            width: 30, height: 30, background: '#6366f1', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '13px',
          }}>
            R
          </Box>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ color: '#1e293b', whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}
          >
            Timesheet Generator
          </Typography>
        </Box>

        {/* Month navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={onPrev} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ minWidth: { xs: 80, sm: 130 }, textAlign: 'center', color: '#1e293b' }}
          >
            {isMobile
              ? `${MONTH_NAMES[month - 1].slice(0, 3)} ${year}`
              : `${MONTH_NAMES[month - 1]} ${year}`}
          </Typography>
          <IconButton size="small" onClick={onNext} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* NSE toggle */}
        <Tooltip title={`NSE Holidays — ${badge.label}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Switch
              checked={holidaysEnabled}
              onChange={onToggleHolidays}
              size="small"
              sx={{ '& .MuiSwitch-thumb': { background: holidaysEnabled ? '#6366f1' : undefined } }}
            />
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: '#475569', display: { xs: 'none', md: 'block' } }}
            >
              NSE
            </Typography>
            <Chip
              label={badge.label}
              color={badge.color}
              size="small"
              sx={{ height: 20, fontSize: '10px', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
            />
            <Tooltip title="Refresh holiday data">
              <IconButton
                size="small"
                onClick={onRefreshHolidays}
                sx={{ color: '#94a3b8', display: { xs: 'none', sm: 'flex' } }}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Tooltip>

        {/* Regenerate */}
        <Tooltip title="Regenerate timesheet">
          <span>
            <IconButton
              size="small"
              onClick={onRegenerate}
              sx={{ border: '1px solid #e2e8f0', borderRadius: '6px', color: '#64748b' }}
            >
              <SyncIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Preview & Download — full button on sm+, icon only on xs */}
        <Tooltip title="Preview & Download">
          <span>
            <Button
              size="small"
              startIcon={<PreviewIcon />}
              onClick={onPreview}
              disabled={!hasRows}
              variant="contained"
              sx={{
                background: '#6366f1',
                textTransform: 'none',
                borderRadius: '7px',
                '&:hover': { background: '#4f46e5' },
                minWidth: 0,
                px: { xs: 1, sm: 2 },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Preview & Download
              </Box>
            </Button>
          </span>
        </Tooltip>

        {/* Account */}
        <Tooltip title="Account">
          <IconButton size="small" onClick={onSettings} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <AccountCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

      </Toolbar>
    </AppBar>
  );
};
