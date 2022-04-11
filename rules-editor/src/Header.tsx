import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ReactComponent as BalenaIcon } from './balena.svg';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Check, Clear } from '@mui/icons-material';
import VoiceLedDisplay from './VoiceLedDisplay';
import { updateSentences } from './SentencesRequests';
import {
  restartHaas,
  updateConfigFile,
  updateIntents,
} from './IntentsRequests';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';

interface HeaderProps {
  sentences: string;
  intents: string;
  config: string;
  selectedFile: string;
  setSelectedFile: Function;
}

export default function Header({
  sentences,
  intents,
  config,
  selectedFile,
  setSelectedFile,
}: HeaderProps) {
  const [syncStatus, setSyncStatus] = useState('ok');

  const sync = async (): Promise<void> => {
    setSyncStatus('loading');
    try {
      await updateSentences(sentences);
      await updateIntents(intents);
      await updateConfigFile(config);
      await restartHaas();
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
          <div style={{ marginLeft: '1%' }}></div>
          <VoiceLedDisplay />
          <div style={{ marginLeft: '35%' }}></div>
          <Select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <MenuItem value='intents'>intents.yaml</MenuItem>
            <MenuItem value='configuration'>configuration.yaml</MenuItem>
          </Select>

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
