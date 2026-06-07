import React, { useState } from 'react';
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
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Props {
  defaultTo: string;
  defaultCc: string;
  defaultBcc: string;
  defaultSubject: string;
  onSend: (payload: { to: string; cc: string; bcc: string; subject: string; body: string }) => Promise<void>;
  onClose: () => void;
}

export const SendModal: React.FC<Props> = ({ defaultTo, defaultCc, defaultBcc, defaultSubject, onSend, onClose }) => {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState(defaultCc);
  const [bcc, setBcc] = useState(defaultBcc);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    setSending(true);
    setError('');
    try {
      await onSend({ to, cc, bcc, subject, body });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Send failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>Send Timesheet</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
          <TextField label="To" value={to} onChange={(e) => setTo(e.target.value)} size="small" fullWidth />
          <TextField label="CC" value={cc} onChange={(e) => setCc(e.target.value)} size="small" fullWidth />
          <TextField label="BCC" value={bcc} onChange={(e) => setBcc(e.target.value)} size="small" fullWidth />
          <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} size="small" fullWidth />
          <TextField
            label="Message (optional)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            minRows={3}
            size="small"
            fullWidth
          />
          <Alert
            icon={<AttachFileIcon fontSize="small" />}
            severity="info"
            sx={{ borderRadius: '8px', fontSize: '13px', py: 0.5 }}
          >
            Timesheet .xlsx will be attached automatically
          </Alert>
        </Box>

        {error && (
          <Typography variant="body2" sx={{ color: '#b91c1c', mt: 2 }}>{error}</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#e2e8f0', color: '#475569', textTransform: 'none', borderRadius: '7px' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          disabled={sending || !to.trim()}
          variant="contained"
          startIcon={<span>✉</span>}
          sx={{ background: '#6366f1', textTransform: 'none', borderRadius: '7px', '&:hover': { background: '#4f46e5' } }}
        >
          {sending ? 'Sending…' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
