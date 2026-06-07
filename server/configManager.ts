import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'config.json');

export interface Config {
  employee: {
    number: string;
    name: string;
    client: string;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    username: string;
    password: string;
    from_email: string;
    to: string;
    cc: string;
    bcc: string;
    subject_template: string;
  };
}

const DEFAULT: Config = {
  employee: { number: 'RTPL1443', name: 'Kalpesh Varma', client: 'Upstox' },
  email: {
    smtp_host: 'smtp.zoho.in',
    smtp_port: 587,
    username: '',
    password: '',
    from_email: '',
    to: '',
    cc: '',
    bcc: '',
    subject_template: 'Timesheet {month} {year} - {name}',
  },
};

export function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      return {
        employee: { ...DEFAULT.employee, ...raw.employee },
        email:    { ...DEFAULT.email,    ...raw.email    },
      };
    }
  } catch { /* ignore */ }
  return structuredClone(DEFAULT);
}

export function loadConfigSafe() {
  const cfg = loadConfig();
  const { password, ...emailRest } = cfg.email;
  return {
    ...cfg,
    email: { ...emailRest, password: '', has_password: !!password },
  };
}

export function saveConfig(incoming: Config): void {
  const existing = loadConfig();
  // Preserve existing password if incoming is blank
  const password = incoming.email?.password || existing.email.password;
  const toSave: Config = { ...incoming, email: { ...incoming.email, password } };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(toSave, null, 2));
}
