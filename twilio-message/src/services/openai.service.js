import OpenAI from "openai";
import { CONFIG } from "../config/env.js";

/**
 * OpenAI Service - Handles communication with OpenAI Responses API
 * Uses the v1/responses endpoint for stateful AI agent interactions
 */

const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY,
});

/**
 * Process customer message through OpenAI AI Agent
 * @param {Object} params - Processing parameters
 * @param {string} params.conversationId - Unique conversation identifier
 * @param {string} params.customerMessage - The customer's message
 * @param {Object} params.context - Additional context (customer data, orders, etc.)
 * @returns {Promise<Object>} AI response with message and status
 */
export async function processWithAI({ conversationId, customerMessage, context }) {
  try {
    console.log(`🤖 Processing message with OpenAI Agent...`);
    console.log(`   Conversation ID: ${conversationId}`);
    console.log(`   Message: ${customerMessage}`);

    // Prepare the context for AI Agent
    const systemContext = buildSystemContext(context);
    
    // Call OpenAI Responses API
    const response = await openai.chat.completions.create({
      model: CONFIG.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemContext,
        },
        {
          role: "user",
          content: customerMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      metadata: {
        conversation_id: conversationId,
        channel: "whatsapp",
      },
    });

    const aiMessage = response.choices[0].message.content;
    
    // Analyze intent/status from AI response
    const status = analyzeResponseStatus(aiMessage, context);

    console.log(`✅ AI Response: ${aiMessage.substring(0, 100)}...`);
    console.log(`   Status: ${status}`);

    return {
      message: aiMessage,
      status, // "resolved", "handover", "abandon"
      conversationId,
      tokens: response.usage.total_tokens,
    };
  } catch (error) {
    console.error("❌ OpenAI Service Error:", error.message);
    throw new Error("AI processing failed");
  }
}

/**
 * Build system context for AI Agent
 * @param {Object} context - Customer and business context
 * @returns {string} Formatted system prompt
 */
function buildSystemContext(context) {
  const { customer, orders, phoneNumber, businessHours } = context;

  let systemPrompt = `You are an AI customer care assistant for an e-commerce platform.

**Your Role:**
- Help customers with order inquiries, product questions, and account issues
- Be friendly, professional, and empathetic
- Provide accurate information based on available data
- Know when to escalate to human agents

**Available Customer Data:**
- Phone: ${phoneNumber}
`;

  if (customer && customer.exists) {
    systemPrompt += `- Customer Status: Registered
- Customer ID: ${customer.customerId || "N/A"}
`;
  } else {
    systemPrompt += `- Customer Status: New/Unregistered
- Action: Encourage registration for better service
`;
  }

  if (orders && orders.length > 0) {
    systemPrompt += `\n**Recent Orders:**\n`;
    orders.slice(0, 3).forEach((order, idx) => {
      systemPrompt += `${idx + 1}. Order #${order.orderId || order.id} - Status: ${order.status || "N/A"}\n`;
    });
  } else {
    systemPrompt += `\n- No recent orders found\n`;
  }

  systemPrompt += `\n**Business Hours:** ${businessHours ? "Open" : "Closed"}

**Instructions:**
1. Answer customer questions clearly and concisely
2. If you can fully resolve the issue, do so confidently
3. If the issue requires human intervention (refunds, complex issues, angry customers), indicate handover
4. If customer is abusive or request is invalid, indicate abandon
5. Use WhatsApp-friendly formatting (no markdown, keep it simple)

**Response Guidelines:**
- Keep responses under 160 characters when possible
- Use emojis sparingly and professionally
- Always end with a clear next step or question

Respond naturally to the customer's message below.`;

  return systemPrompt;
}

/**
 * Analyze AI response to determine conversation status
 * @param {string} aiMessage - The AI's response
 * @param {Object} context - Conversation context
 * @returns {string} Status: "resolved", "handover", or "abandon"
 */
function analyzeResponseStatus(aiMessage, context) {
  const lowerMessage = aiMessage.toLowerCase();

  // Check for handover indicators
  const handoverKeywords = [
    "transfer",
    "agent",
    "representative",
    "human",
    "speak to",
    "talk to someone",
    "escalate",
    "manager",
  ];

  // Check for resolution indicators
  const resolvedKeywords = [
    "you're all set",
    "resolved",
    "completed",
    "anything else",
    "help you with anything else",
    "is there anything",
  ];

  // Check for abandon indicators
  const abandonKeywords = [
    "cannot help",
    "unable to assist",
    "inappropriate",
    "not available",
    "outside business hours",
  ];

  if (abandonKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return "abandon";
  }

  if (handoverKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return "handover";
  }

  if (resolvedKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return "resolved";
  }

  // Default: conversation continues (resolved for now)
  return "resolved";
}

/**
 * Create a chat drop ticket for human agent handover
 * @param {Object} params - Ticket parameters
 * @returns {Promise<Object>} Created ticket information
 */
export async function createChatDropTicket({ conversationId, phoneNumber, context, reason }) {
  try {
    console.log(`🎫 Creating chat drop ticket for ${phoneNumber}...`);

    // This would integrate with your ticketing system API
    // For now, returning a mock response
    const ticket = {
      ticketId: `TICKET-${Date.now()}`,
      conversationId,
      phoneNumber,
      reason,
      status: "pending_agent",
      createdAt: new Date().toISOString(),
    };

    // TODO: Integrate with actual ticketing system
    // await httpClient.post(CONFIG.TICKETING_API_URL, ticket);

    console.log(`✅ Ticket created: ${ticket.ticketId}`);
    return ticket;
  } catch (error) {
    console.error("❌ Ticket creation error:", error.message);
    throw new Error("Failed to create support ticket");
  }
}

