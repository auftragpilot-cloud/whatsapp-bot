const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 Test Route
app.get('/', (req, res) => {
  res.send('Server läuft 🚀');
});

// ✅ WICHTIG: Webhook Verifizierung (GET)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "mein_token_123";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verifiziert');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 📩 Webhook empfängt Nachrichten (POST)
app.post('/webhook', (req, res) => {
  console.log('🔥 WEBHOOK HIT');
  console.log(JSON.stringify(req.body, null, 2));

//WICHTIG:
  res.sendStatus(200).json({ succes: true });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});