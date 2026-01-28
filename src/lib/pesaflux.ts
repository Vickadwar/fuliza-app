// src/lib/pesaflux.ts

export const SAFARICOM_REGEX = /^(?:254|\+254|0)?((7(?:0[0-9]|1[0-9]|2[0-9]|4[0-35-68]|5[7-9]|6[8-9]|9[0-9]))|(1(?:1[0-5])))[0-9]{6}$/;

/**
 * Formats phone number to 2547... format required by Pesaflux
 * Throws error if not a valid Safaricom number
 */
export function formatPhoneForPesaflux(phone: string): string {
  // Remove spaces, dashes, plus signs
  let clean = phone.replace(/[\s\-\+]/g, '');

  // Validate it's Safaricom before processing
  if (!SAFARICOM_REGEX.test(clean)) {
    throw new Error("Invalid Safaricom number");
  }

  // Normalize to 254
  if (clean.startsWith('0')) {
    return '254' + clean.substring(1);
  } else if (clean.startsWith('7') || clean.startsWith('1')) {
    return '254' + clean;
  }
  
  return clean; // Already 254...
}