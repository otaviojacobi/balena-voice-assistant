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
  sentences: string;
  intents: string;
}

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1MTUxNWRjNzUyY2I0MDcwOTI5ZDcxOTg5MzhlYTIwOCIsImlhdCI6MTY0ODgzOTk2OSwiZXhwIjoxNjgwMzc1OTY5fQ.3-_b8EUGB9UC6fgWG18zW_G-qa9apxeCJb-3KbO-ZPE';

export default function Header({ sentences, intents }: HeaderProps) {
  const [syncStatus, setSyncStatus] = useState('ok');

  const updateSentences = async (): Promise<void> => {
    await axios.post('/rhasspy/api/sentences', {
      'sentences.ini': sentences,
    });
    await axios.post('/rhasspy/api/train');
    await axios.post('/rhasspy/api/restart');
  };

  const updateIntents = async (): Promise<void> => {
    const checkIntents = await axios.get(
      '/haconfig/api/file?filename=/hass-config/intents.yaml',
    );

    if (checkIntents['data'] === 'File not found') {
      console.log('inside');
      const newFileBody = new URLSearchParams({
        path: '/hass-config',
        name: 'intents.yaml',
      });

      await axios.post('/haconfig/api/newfile', newFileBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    }

    const updateFileBody = new URLSearchParams({
      filename: '/hass-config/intents.yaml',
      text: intents,
    });

    await axios.post('/haconfig/api/save', updateFileBody, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const restart = await axios.post(
      '/haas/api/services/homeassistant/restart',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log(restart);
  };

  const sync = async (): Promise<void> => {
    setSyncStatus('loading');
    try {
      await updateSentences();
      await updateIntents();
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
          <Button onClick={sync} color='inherit'>
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
