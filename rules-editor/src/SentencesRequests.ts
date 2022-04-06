import axios from 'axios';

export  async function updateSentences(sentences: string): Promise<void> {
  await axios.post('/rhasspy/api/sentences', {
    'sentences.ini': sentences,
  });
  await axios.post('/rhasspy/api/train');
  await axios.post('/rhasspy/api/restart');
};