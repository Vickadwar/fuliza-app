'use server'

import { sendFluxSMS } from "@/lib/flux-client";

/**
 * Sends the payment confirmation + activation steps.
 * Optimized to be short (~145 chars) to save costs.
 */
export async function sendFulizaSuccessSMS(phone: string, fee: number, receipt: string) {
  // Message Breakdown:
  // 1. Confirm Payment & Ref
  // 2. Set expectation (24-48hrs)
  // 3. Give immediate Action (*234# > Opt Out > Opt In)
  
  const msg = `Payment KES ${fee} received. Ref: ${receipt}. Upgrade queued (24-48hrs). To activate: Dial *234# > Fuliza > Opt Out. Wait 5min. Dial *234# to Opt In.`;
  
  console.log(`[SMS] Sending to ${phone}: ${msg}`);
  return await sendFluxSMS(phone, msg);
}