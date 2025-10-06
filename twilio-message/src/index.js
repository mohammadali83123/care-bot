import express from "express";
import twilio from "twilio";

const app = express();
app.use(express.urlencoded({ extended: false }));

const MessagingResponse = twilio.twiml.MessagingResponse;

app.post("/whatsapp", (req, res) => {
  const msgFrom = req.body.From;
  const msgBody = req.body.Body;

  console.log(`📩 Message from ${msgFrom}: ${msgBody}`);

  // --- your AI agent logic here ---
  const aiReply = `You said: ${msgBody}`;

  // Build Twilio WhatsApp reply
  const twiml = new MessagingResponse();
  twiml.message(aiReply);

  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
});

app.listen(3000, () => console.log("🚀 Webhook running on port 3000"));
