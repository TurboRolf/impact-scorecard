/**
 * Convert an ISO 3166-1 alpha-2 country code (e.g. "US", "SE") to a flag emoji.
 */
export const countryCodeToFlag = (countryCode: string | null | undefined): string | null => {
  if (!countryCode || countryCode.length !== 2) return null;
  const code = countryCode.toUpperCase();
  const offset = 127397;
  return String.fromCodePoint(...[...code].map(c => c.charCodeAt(0) + offset));
};
