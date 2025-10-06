import { httpClient } from "../utils/httpClient.js";
import { CONFIG } from "../config/env.js";

export async function checkCustomerExists(phoneNumber) {
  try {
    const normalizedPhoneNumber = phoneNumber.replace("+92", "0");
    const response = await httpClient.get(`${CONFIG.CHECK_USER_REGISTERATION_API_URL}/${normalizedPhoneNumber}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error checking customer:", error.message);
    throw new Error("Customer check failed");
  }
}

export async function getUserOrders(phoneNumber){
  try{
    const payload = {
      "store_number": `${phoneNumber}`,
    };

    const response = await httpClient.post(`${CONFIG.GET_USER_ORDERS_API_URL}`, payload, {
      headers: {
        "userChannel":"COMMANDO",
        "userScopes":"catalog.pricing.all.read",
        "isValidated":true,
        "userId":"essam-user-id",
      }
    });
    return response.data;
  } catch(err){
    console.error("❌ Error getting user orders:", err.message);
    throw new Error("User orders fetch failed");
  }
}