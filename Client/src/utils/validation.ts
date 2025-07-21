/**
 * Validate email format
 * @param email Email to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param phoneNumber Phone number to validate
 * @returns boolean indicating if phone number is valid
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Format phone number to international format if needed
 * @param phoneNumber Phone number to format
 * @param defaultCountryCode Default country code if not provided (e.g., "972" for Israel)
 * @returns Formatted phone number or null if invalid
 */
export function formatPhoneNumber(
  phoneNumber: string,
  defaultCountryCode: string = "972"
): string | null {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // If already has + prefix, validate and return
  if (phoneNumber.startsWith("+")) {
    return isValidPhoneNumber(phoneNumber) ? phoneNumber : null;
  }

  // If starts with 0 (local format), replace with country code
  if (cleaned.startsWith("0")) {
    const formatted = `+${defaultCountryCode}${cleaned.substring(1)}`;
    return isValidPhoneNumber(formatted) ? formatted : null;
  }

  // If no prefix, add country code
  const formatted = `+${defaultCountryCode}${cleaned}`;
  return isValidPhoneNumber(formatted) ? formatted : null;
}

/**
 * Validate 2FA code format (6 digits)
 * @param code Code to validate
 * @returns boolean indicating if code is valid
 */
export function isValid2FACode(code: string): boolean {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
}
