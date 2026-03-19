const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('👉 IRGENDEIN REQUEST ANGEKOMMEN:', req.method, req.url);
  next();
});

app.get('/', (req, res) => {
  res.send('Server läuft 🚀');
});

app.post('/webhook', (req, res) => {
  console.log('🔥 WEBHOOK HIT');
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});