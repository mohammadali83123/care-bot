import twilio from "twilio";
import { checkCustomerExists, getUserOrders } from "../services/customer.service.js";
import { processWithAI, createChatDropTicket } from "../services/openai.service.js";
import { getSession, updateSession } from "../services/session.service.js";
import { isBusinessHours, getBusinessHoursMessage } from "../services/business-hours.service.js";
import { logger } from "../utils/logger.js";

const MessagingResponse = twilio.twiml.MessagingResponse;

/**
 * Main WhatsApp Message Handler
 * Implements the complete workflow as per the diagram:
 * 1. Receive message
 * 2. Check business hours
 * 3. Validate customer
 * 4. Process with AI Agent
 * 5. Handle response based on status (Resolved/Handover/Abandon)
 */
export async function handleIncomingMessage(req, res) {
  const msgFrom = req.body.From;
  const msgBody = req.body.Body;

  logger.incoming(msgFrom, msgBody);

  try {
    // Step 1: Configure Date & Time / Get Session
    logger.workflow("Session Management", "processing");
    const session = getSession(msgFrom);
    
    // Step 2: Check Business Hours
    logger.workflow("Business Hours Check", "processing");
    const businessHoursStatus = isBusinessHours();

    if (!businessHoursStatus.isOpen) {
      logger.workflow("Business Hours Check", "failed", "Outside business hours");
      const defaultMessage = getBusinessHoursMessage();
      await sendWhatsAppMessage(res, defaultMessage);
      return;
    }

    logger.workflow("Business Hours Check", "success", "Within business hours");

    // Step 3: Set Variables (tokens, phoneNumber, customerId, customName)
    logger.workflow("Customer Validation", "processing");
    const customer = await checkCustomerExists(msgFrom);
    
    let userOrders = null;
    if (customer && customer.exists) {
      logger.workflow("Customer Found", "success", `Customer ID: ${customer.customerId || "N/A"}`);
      
      // Step 4: Check Customer Registration (API Call)
      logger.workflow("Fetching Orders", "processing");
      try {
        userOrders = await getUserOrders(msgFrom);
        logger.workflow("Fetching Orders", "success", `Found ${userOrders?.length || 0} orders`);
      } catch (err) {
        logger.warn("Could not fetch orders, continuing without them", { error: err.message });
      }
    } else {
      logger.workflow("Customer Validation", "success", "New customer");
    }

    // Step 5: Set Variables (custOrders)
    const context = {
      phoneNumber: msgFrom,
      customer,
      orders: userOrders,
      businessHours: businessHoursStatus.isOpen,
    };

    // Update session with customer context
    updateSession(msgFrom, { 
      message: msgBody, 
      role: "user",
      context 
    });

    // Step 6: Make Connection with AI Agent (Pass variables to AI Agent Config)
    logger.workflow("AI Processing", "processing", "Sending to OpenAI");
    
    const aiResponse = await processWithAI({
      conversationId: session.conversationId,
      customerMessage: msgBody,
      context,
    });

    // Save AI response to session
    updateSession(msgFrom, { 
      message: aiResponse.message, 
      role: "assistant" 
    });

    logger.workflow("AI Processing", "success", `Status: ${aiResponse.status}`);

    // Step 7: Handle AI Agent Return Status
    switch (aiResponse.status) {
      case "resolved":
        // Conversation resolved, send response and terminate
        logger.workflow("Resolution", "success", "Sending AI response to customer");
        await sendWhatsAppMessage(res, aiResponse.message);
        break;

      case "handover":
        // Escalate to human agent
        logger.workflow("Handover", "processing", "Creating support ticket");
        
        const ticket = await createChatDropTicket({
          conversationId: session.conversationId,
          phoneNumber: msgFrom,
          context,
          reason: "AI requested handover",
        });

        const handoverMessage = `${aiResponse.message}\n\n🎫 Ticket #${ticket.ticketId} created. A human agent will assist you shortly.`;
        await sendWhatsAppMessage(res, handoverMessage);
        
        logger.workflow("Handover", "success", `Ticket: ${ticket.ticketId}`);
        break;

      case "abandon":
        // Conversation abandoned
        logger.workflow("Abandon", "success", "Sending final message");
        await sendWhatsAppMessage(res, aiResponse.message);
        break;

      default:
        // Fallback
        logger.warn("Unknown AI status, treating as resolved", { status: aiResponse.status });
        await sendWhatsAppMessage(res, aiResponse.message);
    }

  } catch (err) {
    logger.error("Controller error", { 
      error: err.message, 
      stack: err.stack,
      from: msgFrom 
    });
    
    // Send error message to customer
    const errorMessage = "Sorry, we're experiencing technical difficulties. Please try again later.";
    await sendWhatsAppMessage(res, errorMessage);
  }
}

/**
 * Send WhatsApp message via Twilio
 * @param {Object} res - Express response object
 * @param {string} message - Message to send
 */
async function sendWhatsAppMessage(res, message) {
  const twiml = new MessagingResponse();
  twiml.message(message);

  logger.outgoing("Customer", message);

  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
}