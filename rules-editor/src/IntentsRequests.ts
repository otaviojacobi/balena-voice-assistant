import axios from 'axios';

export async function createIntentFiles(): Promise<void> {
  const newFileBody = new URLSearchParams({
    path: '/hass-config',
    name: 'intents.yaml',
  });

  await axios.post('/haconfig/api/newfile', newFileBody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export async function updateIntentsFile(intents: string): Promise<void> {
  const token = process.env.HASS_ACCESS_TOKEN;

  const updateFileBody = new URLSearchParams({
    filename: '/hass-config/intents.yaml',
    text: intents,
  });

  await axios.post('/haconfig/api/save', updateFileBody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  await axios.post(
    '/haas/api/services/homeassistant/restart',
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

export async function  updateIntents(intents: string): Promise<void> {
  const checkIntents = await axios.get(
    '/haconfig/api/file?filename=/hass-config/intents.yaml',
  );

  if (checkIntents['data'] === 'File not found') {
    await createIntentFiles();
  }

  await updateIntentsFile(intents);
};