const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG: zeigt ALLES an
app.use((req, res, next) => {
  console.log('👉 REQUEST:', req.method, req.url);
  next();
});

// ROOT TEST
app.get('/', (req, res) => {
  res.send('Server läuft 🚀');
});


// 🔥 WICHTIG: GET Webhook Verifizierung (für 360dialog / Meta)
app.get('/webhook', (req, res) => {
  console.log('✅ Webhook Verification Request:', req.query);

  const verifyToken = "mein_token_123"; // kannst du so lassen

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verifiziert');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verifizierung fehlgeschlagen');
    res.sendStatus(403);
  }
});


// 🔥 POST: eingehende Nachrichten
app.post('/webhook', (req, res) => {
  console.log('🔥 WEBHOOK HIT');
  console.log('📩 BODY:', JSON.stringify(req.body, null, 2));

  // GANZ WICHTIG:
  res.sendStatus(200);
});


// PORT (Railway automatisch)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});