import twilio from "twilio";
import { checkCustomerExists } from "../services/customer.service.js";

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function handleIncomingMessage(req, res) {
  const msgFrom = req.body.From;
  const msgBody = req.body.Body;

  console.log(`📩 Message from ${msgFrom}: ${msgBody}`);

  try {
    const customer = await checkCustomerExists(msgFrom);

    const aiReply = customer.exists
      ? `Welcome back, ${msgFrom}! How can I assist you today?`
      : "Hi there! Looks like you're new. Please register to get started.";

    const twiml = new MessagingResponse();
    twiml.message(aiReply);

    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
  } catch (err) {
    console.error("⚠️ Controller error:", err.message);
    res.status(500).send("Internal server error");
  }
}