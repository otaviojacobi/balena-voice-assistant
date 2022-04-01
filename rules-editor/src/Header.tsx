import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ReactComponent as BalenaIcon } from './balena.svg';
import axios from 'axios';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Check, Clear } from '@mui/icons-material';

interface HeaderProps {
  intents: string;
}

export default function Header({ intents }: HeaderProps) {
  const [syncStatus, setSyncStatus] = useState('ok');

  const updateSentences = async () => {
    setSyncStatus('loading');
    try {
      await axios.post('http://192.168.0.40:12101/api/sentences', {
        'sentences.ini': intents,
      });
      await axios.post('http://192.168.0.40:12101/api/train');
      await axios.post('http://192.168.0.40:12101/api/restart');
      setSyncStatus('ok');
    } catch (e) {
      console.error('Failed to sync with error', e);
      setSyncStatus('fail');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' color='transparent'>
        <Toolbar>
          <BalenaIcon />
          <Typography
            variant='h5'
            component='div'
            sx={{ fontWeight: 'bold', color: '#2A506F' }}
          >
            Assistant
          </Typography>
          <div style={{ marginLeft: '36%' }}></div>
          <Button onClick={updateSentences} color='inherit'>
            REBUILD
          </Button>
          {syncStatus === 'ok' && <Check color='success' />}
          {syncStatus === 'loading' && <CircularProgress size={26} />}
          {syncStatus === 'fail' && <Clear color='error' />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
