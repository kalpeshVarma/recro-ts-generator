import React from 'react';
import { Select, MenuItem, ListSubheader, Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Status } from '../types';
import { STATUS_CONFIG, STATUS_GROUPS } from '../utils/statusConfig';

interface Props {
  status: Status;
  onChange: (status: Status) => void;
}

export const StatusChip: React.FC<Props> = ({ status, onChange }) => {
  const cfg = STATUS_CONFIG[status];

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Select
        value={status}
        onChange={(e) => onChange(e.target.value as Status)}
        variant="standard"
        disableUnderline
        IconComponent={ArrowDropDownIcon}
        sx={{
          background: cfg.chipBg,
          color: cfg.chipColor,
          borderRadius: '999px',
          px: 1.25,
          py: 0.25,
          fontSize: '13px',
          fontWeight: 600,
          border: '1.5px solid transparent',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:hover': {
            borderColor: 'rgba(0,0,0,0.18)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          },
          '& .MuiSelect-icon': {
            color: cfg.chipColor,
            right: 4,
          },
          '& .MuiSelect-select': {
            pr: '24px !important',
            py: '3px !important',
            pl: '2px !important',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              mt: 0.5,
            },
          },
        }}
      >
        {STATUS_GROUPS.flatMap(({ group, statuses }) =>
          group
            ? [
                <ListSubheader key={group} sx={{ fontSize: '11px', color: '#94a3b8', lineHeight: '28px', userSelect: 'none' }}>
                  {`── ${group} ──────────`}
                </ListSubheader>,
                ...statuses.map((s) => (
                  <MenuItem key={s} value={s} sx={{ fontSize: '13px', py: 0.75 }}>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.25,
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: STATUS_CONFIG[s].chipBg,
                        color: STATUS_CONFIG[s].chipColor,
                      }}
                    >
                      {STATUS_CONFIG[s].label}
                    </Box>
                  </MenuItem>
                )),
              ]
            : statuses.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: '13px', py: 0.75 }}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.25,
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: STATUS_CONFIG[s].chipBg,
                      color: STATUS_CONFIG[s].chipColor,
                    }}
                  >
                    {STATUS_CONFIG[s].label}
                  </Box>
                </MenuItem>
              ))
        )}
      </Select>
    </Box>
  );
};
