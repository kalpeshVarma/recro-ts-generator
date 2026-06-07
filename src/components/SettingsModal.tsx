import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
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
  const [draft, setDraft] = useState<Config>(config);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setDraft(config); }, [config]);

  const setEmployee = (patch: Partial<Config['employee']>) =>
    setDraft((d) => ({ ...d, employee: { ...d.employee, ...patch } }));

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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>Settings</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
          <TextField label="Employee Number" value={draft.employee.number} onChange={(e) => setEmployee({ number: e.target.value })} size="small" fullWidth />
          <TextField label="Employee Name"   value={draft.employee.name}   onChange={(e) => setEmployee({ name: e.target.value })}   size="small" fullWidth />
          <TextField label="Client Name"     value={draft.employee.client} onChange={(e) => setEmployee({ client: e.target.value })} size="small" fullWidth />
        </Box>

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
