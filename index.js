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

    if (message) {
      const from = message.from;
      const userText = message.text?.body || "";

      console.log("📩 Nachricht:", userText);

      // 👉 1. AN N8N SENDEN
      await axios.post(
        "https://auftragpilot.app.n8n.cloud/webhook-test/whatsapp-lead",
        {
          from: from,
          message: userText
        }
      );

      // 👉 2. ANTWORT AN WHATSAPP
      await axios.post(
        "https://waba-v2.360dialog.io/v1/messages",
        {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: "Danke für deine Anfrage! Wir melden uns gleich 👍"
          }
        },
        {
          headers: {
            "D360-API-KEY": process.env.API_KEY,
            "Content-Type": "application/json"
          }
        }
      );
    }
  } catch (err) {
    console.log("❌ Fehler:", err.response?.data || err.message);
  }

  res.sendStatus(200);
});

// 🔥 SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});