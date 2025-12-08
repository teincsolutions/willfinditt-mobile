/**
 * Format Ghana phone number to international format
 * Converts local format (0XXXXXXXXX) to international format (+233XXXXXXXXX)
 * 
 * @param phone - Phone number to format (can be 9 or 10 digits)
 * @param countryCode - Country code (default: "+233" for Ghana)
 * @returns Formatted phone number in international format
 * 
 * @example
 * formatPhoneNumber("0244123456") // returns "+233244123456"
 * formatPhoneNumber("244123456")  // returns "+233244123456"
 */
export function formatPhoneNumber(
  phone: string,
  countryCode: string = "+233"
): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Remove leading zero if present (converts 0XXXXXXXXX to XXXXXXXXX)
  const withoutLeadingZero = cleaned.startsWith("0")
    ? cleaned.substring(1)
    : cleaned;

  // Remove country code if already present (233XXXXXXXXX to XXXXXXXXX)
  const withoutCountryCode = withoutLeadingZero.startsWith("233")
    ? withoutLeadingZero.substring(3)
    : withoutLeadingZero;

  // Ensure we have exactly 9 digits
  if (withoutCountryCode.length !== 9) {
    throw new Error(
      `Invalid phone number length. Expected 9 digits, got ${withoutCountryCode.length}`
    );
  }

  // Return formatted number with country code
  return `${countryCode}${withoutCountryCode}`;
}

/**
 * Format phone number for display (with spaces for readability)
 * 
 * @param phone - Phone number to format
 * @returns Formatted phone number with spaces
 * 
 * @example
 * formatPhoneNumberDisplay("+233244123456") // returns "+233 24 412 3456"
 */
export function formatPhoneNumberDisplay(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  
  // Format as: +233 XX XXX XXXX
  return formatted.replace(/(\+233)(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
}

/**
 * Validate Ghana phone number
 * 
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidGhanaPhoneNumber(phone: string): boolean {
  try {
    const formatted = formatPhoneNumber(phone);
    // Ghana phone numbers start with specific prefixes (20, 23, 24, 25, 26, 27, 28, 29, 50, 54, 55, 56, 57, 59)
    const validPrefixes = /^\+233(2[0-9]|5[0456789])/;
    return validPrefixes.test(formatted);
  } catch {
    return false;
  }
}
