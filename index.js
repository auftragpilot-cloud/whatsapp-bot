const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 👉 HIER DEINE DATEN EINTRAGEN
const API_KEY = 'rs09wb4uyZPUd1Pdm9cKz8dJAK';
const PHONE_NUMBER_ID = '1094395347081397';

app.post('/webhook', async (req, res) => {
  console.log('🔥 WEBHOOK HIT');
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const from = messages[0].from;

      await axios.post(
        'https://waba.360dialog.io/v1/messages',
        {
          to: from,
          type: "text",
          text: {
            body: "Hallo 👋 Nachricht ist angekommen!"
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (err) {
    console.log('❌ Fehler:', err.response?.data || err.message);
  }

  res.status(200).send('EVENT_RECEIVED');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server läuft');
});