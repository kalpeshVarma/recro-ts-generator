export type Status =
  | 'working'
  | 'weekend'
  | 'holiday'
  | 'sick_leave'
  | 'casual_leave'
  | 'earned_leave'
  | 'half_day'
  | 'leave';

export interface Row {
  date: string;
  day: string;
  status: Status;
  hours: number;
  comment: string | null;
  holiday_name: string;
}

export interface EmployeeConfig {
  number: string;
  name: string;
  client: string;
}

export interface EmailConfig {
  smtp_host: string;
  smtp_port: number;
  username: string;
  has_password?: boolean;
  password: string;
  from_email: string;
  to: string;
  cc: string;
  bcc: string;
  subject_template: string;
}

export interface Config {
  employee: EmployeeConfig;
  email: EmailConfig;
}

export type HolidaySource = 'nse' | 'cache' | 'builtin' | 'none';

export interface GenerateResponse {
  rows: Row[];
  holidays_source: HolidaySource;
}
