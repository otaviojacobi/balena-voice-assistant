import { Box } from '@mui/material';
import { Connector } from 'mqtt-react-hooks';
import { useState } from 'react';

export default function VoiceLedDisplay() {
  const [bgcolor, setBgColor] = useState('blue');

  return (
    <Connector
      brokerUrl={'wss://192.168.40.0:1883'}
      parserMethod={(msg: any) => msg}
    >
      <Box sx={{ ...commonStyles, borderRadius: '50%', bgcolor }} />
    </Connector>
  );
}

const commonStyles = {
  borderColor: 'text.primary',
  m: 1,
  border: 1,
  width: '2rem',
  height: '2rem',
};
