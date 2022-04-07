import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

export default function VoiceLedDisplay() {
  const [bgcolor, setBgcolor] = useState('white');

  const handleSubscriptions = (client: mqtt.MqttClient): mqtt.MqttClient => {
    client.on('connect', () => {
      client.subscribe([
        'hermes/asr/startListening',
        'hermes/asr/textCaptured',
      ]);
    });
    client.on('message', (topic: string, message: string) => {
      const parsedMessage = JSON.parse(message);

      console.log(parsedMessage);

      if (topic === 'hermes/asr/startListening') {
        setBgcolor('blue');
      } else if (topic === 'hermes/asr/textCaptured') {
        if (parsedMessage.text === '') {
          setBgcolor('red');
          setTimeout(() => setBgcolor('white'), 2000);
        } else {
          setBgcolor('green');
          setTimeout(() => setBgcolor('white'), 2000);
        }
      }
    });

    client.on('close', () => {
      setBgcolor('gray');
    });

    client.on('error', (e: any) => {
      setBgcolor('gray');
      console.error('error connecting', e);
    });

    return client;
  };

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws';
    const wsLocation = `${protocol}//${window.location.host}/mqtt`;
    try {
      handleSubscriptions(mqtt.connect(wsLocation));
    } catch (e) {
      console.log('failed to connect to mqtt, some things may not work', e);
      setBgcolor('gray');
    }
  }, []);

  return (
    <div>
      <Box sx={{ ...commonStyles, borderRadius: '50%', bgcolor }}></Box>
    </div>
  );
}

const commonStyles = {
  borderColor: 'text.primary',
  m: 1,
  border: 1,
  width: '2rem',
  height: '2rem',
};
