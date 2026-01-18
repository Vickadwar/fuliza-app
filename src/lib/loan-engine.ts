// src/lib/loan-engine.ts

// --- TYPES ---
export type ValidationResult = 
  | { valid: false } 
  | { valid: true; type: string; ageInHours: number; dateString: string };

// 1. VALIDATION LOGIC
export const validateEntry = (phone: string, id: string) => {
  const errors: { phone?: string; id?: string } = {};

  // Safaricom Regex: 07xx, 011x (Standard Kenya Format)
  const saf_regex = /^0((7(?:0[0-9]|1[0-9]|2[0-9]|4[0-35-68]|5[7-9]|6[8-9]|9[0-9]))|(1(?:1[0-5])))[0-9]{6}$/;

  if (phone.length !== 10) {
    errors.phone = "Must be 10 digits";
  } else if (!phone.startsWith('0')) {
    errors.phone = "Must start with 0";
  } else if (!saf_regex.test(phone)) {
    errors.phone = "Safaricom numbers only";
  }

  if (id.length < 6 || id.length > 8) {
    errors.id = "ID must be 6-8 digits";
  } else if (id.startsWith('0')) {
    errors.id = "ID cannot start with 0";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// 2. SMART OTP GENERATOR
export const generateSmartOTP = (phone: string) => {
  const lastFour = parseInt(phone.slice(-4) || "0000");
  const date = new Date().getDate();
  // Simple deterministic math to create a 4-digit code
  return ((lastFour + date + 1234).toString()).slice(-4);
};

// 3. SMART TRACKING ID GENERATOR
// Format: LN-DDMMHH-Q-XXX (Day, Month, Hour, Random)
export const generateTrackingId = () => {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const h = String(now.getHours()).padStart(2, '0');
  const r = Math.floor(100 + Math.random() * 900); // 3 random digits
  
  return `LN-${d}${m}${h}-Q-${r}`;
};

// 4. TRACKING ID ANALYZER (The missing function)
export const analyzeTrackingId = (code: string): ValidationResult => {
  // Regex to match: LN-180117-Q-123
  const regex = /^LN-(\d{2})(\d{2})(\d{2})-Q-(\d{3})$/i;
  const match = code.toUpperCase().match(regex);
  
  if (!match) return { valid: false };
  
  const [_, day, month, hour] = match;
  
  const created = new Date();
  const now = new Date();
  
  // Reconstruct the date from the ID components
  // Note: We assume current year. Month is 0-indexed in JS Date.
  created.setFullYear(now.getFullYear(), parseInt(month) - 1, parseInt(day));
  created.setHours(parseInt(hour), 0, 0, 0);
  
  // Calculate difference in hours
  const diffMs = now.getTime() - created.getTime();
  const diffHours = diffMs / (1000 * 60 * 60); 
  
  return {
    valid: true,
    type: 'Quick Loan',
    ageInHours: diffHours,
    dateString: created.toLocaleString('en-KE', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  };
};