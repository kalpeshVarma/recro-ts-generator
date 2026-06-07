import { Status } from '../types';

export interface StatusConfig {
  label: string;
  hours: number;
  comment: string | null;
  rowBg: string;
  chipBg: string;
  chipColor: string;
}

export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  working:      { label: 'Working',      hours: 9,   comment: null,             rowBg: '#ffffff', chipBg: '#dcfce7', chipColor: '#15803d' },
  weekend:      { label: 'Weekend',      hours: 0,   comment: 'Week off',       rowBg: '#f8fafc', chipBg: '#f1f5f9', chipColor: '#64748b' },
  holiday:      { label: 'Holiday',      hours: 0,   comment: 'Holiday',        rowBg: '#fffbeb', chipBg: '#fef9c3', chipColor: '#854d0e' },
  sick_leave:   { label: 'Sick Leave',   hours: 0,   comment: 'Sick Leave',     rowBg: '#fef2f2', chipBg: '#fee2e2', chipColor: '#b91c1c' },
  casual_leave: { label: 'Casual Leave', hours: 0,   comment: 'Casual Leave',   rowBg: '#fef2f2', chipBg: '#fed7aa', chipColor: '#9a3412' },
  earned_leave: { label: 'Earned Leave', hours: 0,   comment: 'Earned Leave',   rowBg: '#fef2f2', chipBg: '#ede9fe', chipColor: '#5b21b6' },
  half_day:     { label: 'Half Day',     hours: 4.5, comment: 'Half Day Leave', rowBg: '#fff7ed', chipBg: '#ffedd5', chipColor: '#c2410c' },
  leave:        { label: 'Other Leave',  hours: 0,   comment: 'Leave',          rowBg: '#fef2f2', chipBg: '#dbeafe', chipColor: '#1d4ed8' },
};

export type StatusGroup =
  | { group: null; statuses: Status[] }
  | { group: string; statuses: Status[] };

export const STATUS_GROUPS: StatusGroup[] = [
  { group: null,    statuses: ['working', 'weekend', 'holiday'] },
  { group: 'Leave', statuses: ['sick_leave', 'casual_leave', 'earned_leave', 'half_day', 'leave'] },
];
