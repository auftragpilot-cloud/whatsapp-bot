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

await axios.post(
  "https://waba-v2.360dialog.io/messages",
  {
    messaging_product: "whatsapp"
    recipient_type: "individual",
    to: from,
    type: "text",
    text: {
      body: "Antwort funktioniert 🚀"
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});