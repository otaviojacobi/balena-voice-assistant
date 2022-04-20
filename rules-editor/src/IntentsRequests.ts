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

  const updateFileBody = new URLSearchParams({
    filename: '/hass-config/intents.yaml',
    text: intents,
  });

  await axios.post('/haconfig/api/save', updateFileBody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export async function  updateIntents(intents: string): Promise<void> {
  const checkIntents = await axios.get(
    '/haconfig/api/file/intents',
  );

  if (checkIntents['data'] === 'File not found') {
    await createIntentFiles();
  }

  await updateIntentsFile(intents);
};

export async function updateConfigFile(config: string): Promise<void> {
  const updateFileBody = new URLSearchParams({
    filename: '/hass-config/configuration.yaml',
    text: config,
  });

  await axios.post('/haconfig/api/save', updateFileBody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

}
export async function restartHaas() : Promise<void> {
  await axios.post('/haas/api/services/homeassistant/restart');
}