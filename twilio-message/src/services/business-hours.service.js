import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Business Hours Service
 * Validates if current time is within business hours
 */

// Business hours configuration (24-hour format)
const BUSINESS_HOURS = {
  timezone: "Asia/Karachi", // PKT (Pakistan Time)
  hours: {
    monday: { open: "09:00", close: "22:00" },
    tuesday: { open: "09:00", close: "22:00" },
    wednesday: { open: "09:00", close: "22:00" },
    thursday: { open: "09:00", close: "22:00" },
    friday: { open: "09:00", close: "22:00" },
    saturday: { open: "10:00", close: "20:00" },
    sunday: { open: "10:00", close: "20:00" },
  },
};

/**
 * Check if current time is within business hours
 * @returns {Object} Status and details
 */
export function isBusinessHours() {
  const now = dayjs().tz(BUSINESS_HOURS.timezone);
  const dayName = now.format("dddd").toLowerCase();
  const currentTime = now.format("HH:mm");

  const todayHours = BUSINESS_HOURS.hours[dayName];

  if (!todayHours) {
    return {
      isOpen: false,
      reason: "No hours defined for today",
      currentTime,
      dayName,
    };
  }

  const isOpen = currentTime >= todayHours.open && currentTime < todayHours.close;

  return {
    isOpen,
    currentTime,
    dayName,
    openTime: todayHours.open,
    closeTime: todayHours.close,
    timezone: BUSINESS_HOURS.timezone,
  };
}

/**
 * Get a friendly message about business hours
 * @returns {string} Human-readable message
 */
export function getBusinessHoursMessage() {
  const status = isBusinessHours();

  if (status.isOpen) {
    return `We're currently open! Our hours today are ${status.openTime} - ${status.closeTime} ${status.timezone}.`;
  }

  return `We're currently closed. Our hours today (${status.dayName}) are ${status.openTime} - ${status.closeTime} ${status.timezone}. We'll respond to your message when we reopen.`;
}

/**
 * Check if it's time to send default message (outside business hours)
 * @returns {boolean}
 */
export function shouldSendDefaultMessage() {
  return !isBusinessHours().isOpen;
}

/**
 * Get next opening time
 * @returns {Object} Next opening time details
 */
export function getNextOpeningTime() {
  const now = dayjs().tz(BUSINESS_HOURS.timezone);
  const dayName = now.format("dddd").toLowerCase();
  const currentTime = now.format("HH:mm");

  const todayHours = BUSINESS_HOURS.hours[dayName];

  // If today's hours exist and we haven't passed opening time yet
  if (todayHours && currentTime < todayHours.open) {
    return {
      day: dayName,
      time: todayHours.open,
      timezone: BUSINESS_HOURS.timezone,
    };
  }

  // Find next day with hours
  let daysAhead = 1;
  let nextDay = now.add(1, "day");

  while (daysAhead <= 7) {
    const nextDayName = nextDay.format("dddd").toLowerCase();
    const nextDayHours = BUSINESS_HOURS.hours[nextDayName];

    if (nextDayHours) {
      return {
        day: nextDayName,
        time: nextDayHours.open,
        timezone: BUSINESS_HOURS.timezone,
        daysAhead,
      };
    }

    daysAhead++;
    nextDay = nextDay.add(1, "day");
  }

  return null;
}

