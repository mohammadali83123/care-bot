import { httpClient } from "../utils/httpClient.js";
import { CONFIG } from "../config/env.js";

export async function checkCustomerExists(phoneNumber) {
  try {
    const normalizedPhoneNumber = phoneNumber.replace("+92", "0");
    console.log(normalizedPhoneNumber);
    const response = await httpClient.get(`${CONFIG.CHECK_USER_REGISTERATION_API_URL}/${normalizedPhoneNumber}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error checking customer:", error.message);
    throw new Error("Customer check failed");
  }
}