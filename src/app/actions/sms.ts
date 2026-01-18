'use server'
import { sendFluxSMS } from "@/lib/flux-client";

export async function sendOTPSMS(phone: string, code: string) {
  const msg = `DEAR CUSTOMER: Your verification code is ${code}. Do not share this code. Valid for 10 minutes.`;
  await sendFluxSMS(phone, msg);
}

export async function sendAbandonmentSMS(phone: string, name: string) {
  const msg = `Jambo ${name.split(' ')[0]}, your loan limit application is pending. Complete activation now to avoid losing your reserved limit.`;
  await sendFluxSMS(phone, msg);
}