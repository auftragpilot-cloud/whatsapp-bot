const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const userText = message.text?.body?.toLowerCase() || "";

      let reply = "Danke für deine Anfrage! Wir melden uns gleich 👍";

      // 🔧 Sanitär erkennen
      if (
        userText.includes("rohr") ||
        userText.includes("wasser") ||
        userText.includes("heizung") ||
        userText.includes("wc") ||
        userText.includes("verstopft")
      ) {
        reply =
          "Alles klar 🚿 Sanitär-Anfrage erkannt.\nBeschreib bitte kurz dein Problem + Adresse.";
      }

      // 🚨 Notfall erkennen
      if (
        userText.includes("notfall") ||
        userText.includes("wasserschaden") ||
        userText.includes("rohrbruch")
      ) {
        reply =
          "🚨 NOTFALL erkannt!\nWir kümmern uns sofort. Bitte Adresse senden!";
      }

      // 📤 WhatsApp Antwort senden
await axios.post(
  "https://auftragpilot.app.n8n.cloud/webhook-test/whatsapp-lead",
  {
    from: from,
    message: message.text?.body || ""
  }
);

      // 📥 DEBUG / später n8n
      console.log("📩 Anfrage von:", from);
      console.log("📝 Text:", userText);
    }
  } catch (err) {
    console.log("❌ Fehler:", err.response?.data || err.message);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});