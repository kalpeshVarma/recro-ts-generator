import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Config } from '../types';

interface Props {
  config: Config;
  onSave: (cfg: Config) => Promise<void>;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ config, onSave, onClose }) => {
  const [tab, setTab] = useState(0);
  const [draft, setDraft] = useState<Config>(config);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [changePassword, setChangePassword] = useState(false);

  const setEmployee = (patch: Partial<Config['employee']>) =>
    setDraft((d) => ({ ...d, employee: { ...d.employee, ...patch } }));

  const setEmail = (patch: Partial<Config['email']>) =>
    setDraft((d) => ({ ...d, email: { ...d.email, ...patch } }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(draft);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
        <Typography variant="h6" fontWeight={700}>Settings</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <Box sx={{ px: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: '1px solid #e2e8f0', mb: 2 }}
          TabIndicatorProps={{ style: { background: '#6366f1' } }}
        >
          <Tab label="Profile" sx={{ textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: '#6366f1' } }} />
          <Tab label="Email" sx={{ textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: '#6366f1' } }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 0 }}>
        {tab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Employee Number" value={draft.employee.number} onChange={(e) => setEmployee({ number: e.target.value })} size="small" fullWidth />
            <TextField label="Employee Name"   value={draft.employee.name}   onChange={(e) => setEmployee({ name: e.target.value })}   size="small" fullWidth />
            <TextField label="Client Name"     value={draft.employee.client} onChange={(e) => setEmployee({ client: e.target.value })} size="small" fullWidth />
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={8}>
                <TextField label="SMTP Host" value={draft.email.smtp_host} onChange={(e) => setEmail({ smtp_host: e.target.value })} size="small" fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="SMTP Port" type="number" value={draft.email.smtp_port} onChange={(e) => setEmail({ smtp_port: parseInt(e.target.value) || 587 })} size="small" fullWidth />
              </Grid>
            </Grid>

            <TextField
              label="Your Email (From)"
              type="email"
              value={draft.email.username}
              onChange={(e) => setEmail({ username: e.target.value, from_email: e.target.value })}
              size="small"
              fullWidth
            />

            {draft.email.has_password && !changePassword ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#16a34a' }}>✓ App password is saved</Typography>
                <Button size="small" sx={{ color: '#6366f1', textTransform: 'none', p: 0, minWidth: 0 }} onClick={() => setChangePassword(true)}>
                  Change
                </Button>
              </Box>
            ) : (
              <TextField
                label="App Password"
                type="password"
                placeholder={draft.email.has_password ? 'Enter new password to replace' : 'Enter app-specific password'}
                value={draft.email.password}
                onChange={(e) => setEmail({ password: e.target.value })}
                size="small"
                fullWidth
              />
            )}

            <TextField label="To (comma-separated)" value={draft.email.to} onChange={(e) => setEmail({ to: e.target.value })} size="small" fullWidth />
            <TextField label="CC (comma-separated, optional)" value={draft.email.cc} onChange={(e) => setEmail({ cc: e.target.value })} size="small" fullWidth />
            <TextField label="BCC (comma-separated, optional)" value={draft.email.bcc} onChange={(e) => setEmail({ bcc: e.target.value })} size="small" fullWidth />
            <TextField
              label="Subject Template"
              value={draft.email.subject_template}
              onChange={(e) => setEmail({ subject_template: e.target.value })}
              size="small"
              fullWidth
              helperText="Placeholders: {month}, {year}, {name}"
            />
          </Box>
        )}

        {error && (
          <Typography variant="body2" sx={{ color: '#b91c1c', mt: 2 }}>{error}</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#e2e8f0', color: '#475569', textTransform: 'none', borderRadius: '7px' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving} variant="contained" sx={{ background: '#6366f1', textTransform: 'none', borderRadius: '7px', '&:hover': { background: '#4f46e5' } }}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
