const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔥 WEBHOOK ENDPOINT
app.post("/webhook", async (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // 🔥 WICHTIG: Nur echte Textnachrichten verarbeiten
    if (!message || message.type !== "text") {
      return res.sendStatus(200);
    }

    const from = message.from;
    const userText = message.text.body.toLowerCase();

    console.log("📩 Nachricht:", userText);

    // 👉 1. AN N8N SENDEN
    await axios.post(
      "https://auftragpilot.app.n8n.cloud/webhook/whatsapp-lead",
      {
        from: from,
        message: userText,
      }
    );

    // 👉 2. ANTWORT AN WHATSAPP
    
    return res.sendStatus(200);
  } catch (err) {
    console.log("❌ Fehler:", err.response?.data || err.message);
    return res.sendStatus(200);
  }
});

// 🔥 SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});