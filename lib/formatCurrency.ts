/**
 * Formats a number to a localized currency string with only the currency symbol.
 *
 * @param {number} amount The number to format.
 * @param {string} locale The BCP 47 language tag (e.g., 'en-US', 'de-DE').
 * @param {string} currency The ISO 4217 currency code (e.g., 'USD', 'EUR').
 * @returns {string} The formatted currency string, e.g., "₵123,456.70".
 */
export function formatCurrency(
  amount: number,
  locale: string,
  currency: string
): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumSignificantDigits: 3,
      currencyDisplay: "narrowSymbol",
    });
    const formattedAmount = formatter.format(amount);

    return formattedAmount.replace(/[A-Z]/gi, "").trim();
  } catch (error) {
    console.error("Error formatting currency:", error);
    return "Invalid format";
  }
}
