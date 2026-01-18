'use server'

import { sendFluxSMS } from "@/lib/flux-client";

// 1. OTP SMS
export async function sendOTPSMS(phone: string, code: string, service: 'LOAN' | 'FULIZA') {
  const serviceName = service === 'LOAN' ? 'Quick Cash' : 'Fuliza Boost';
  const msg = `Dear Customer, your ${serviceName} verification code is ${code}. Do not share this code. Valid for 10 minutes.`;
  await sendFluxSMS(phone, msg);
}

// 2. Abandonment SMS (Triggered only after hesitation)
export async function sendAbandonmentSMS(phone: string, amount: string, service: 'LOAN' | 'FULIZA') {
  const serviceName = service === 'LOAN' ? 'Quick Cash' : 'Fuliza Boost';
  const action = service === 'LOAN' ? 'receive funds' : 'activate limit';
  
  const msg = `Dear Customer, your ${serviceName} of KES ${amount} is approved but pending activation. Complete the process now to ${action}.`;
  await sendFluxSMS(phone, msg);
}

// 3. Success SMS (Distinct for each service)
export async function sendSuccessSMS(phone: string, amount: number, trackId: string, service: 'LOAN' | 'FULIZA') {
  let msg = "";
  
  if (service === 'FULIZA') {
    msg = `Dear Customer, payment received. Your Fuliza Limit upgrade to KES ${amount.toLocaleString()} is queued. Ref: ${trackId}. Limit reflects in 24-48hrs.`;
  } else {
    msg = `Dear Customer, payment received. Your Quick Cash loan of KES ${amount.toLocaleString()} is processing. Ref: ${trackId}. Disbursement in 24-48hrs.`;
  }
  
  await sendFluxSMS(phone, msg);
}