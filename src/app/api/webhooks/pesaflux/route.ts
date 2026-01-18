import { NextResponse } from 'next/server';
import { sendSuccessSMS } from '@/app/actions/sms';
import { generateTrackingId } from '@/lib/loan-engine';
import { getRedisClient } from '@/lib/redis';
import { sendFluxSMS } from '@/lib/flux-client';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("[Webhook Received]", data);

    const { ResponseCode, CheckoutRequestID, Msisdn, TransactionAmount, TransactionReceipt } = data;
    const redis = await getRedisClient();

    // Fetch existing context (to know if it was Loan or Fuliza)
    const existingStr = await redis.get(`pay:${CheckoutRequestID}`);
    const existing = existingStr ? JSON.parse(existingStr as string) : {};
    const serviceType = existing.serviceType === 'FULIZA_BOOST' ? 'FULIZA' : 'LOAN';

    if (ResponseCode == 0) {
        // --- SUCCESS ---
        const trackId = generateTrackingId();

        // Update Redis
        await redis.set(`pay:${CheckoutRequestID}`, JSON.stringify({
            ...existing,
            status: 'COMPLETED',
            mpesaCode: TransactionReceipt,
            trackId: trackId,
        }), { EX: 3600 });

        // Send Custom Success SMS
        await sendSuccessSMS(Msisdn, TransactionAmount, trackId, serviceType);

    } else {
        // --- FAILED / CANCELLED ---
        await redis.set(`pay:${CheckoutRequestID}`, JSON.stringify({
            ...existing,
            status: 'FAILED',
            reason: 'CANCELLED'
        }), { EX: 600 });
        
        // Send Failure Nudge
        const failMsg = `Dear Customer, the transaction was cancelled. To activate your ${serviceType === 'FULIZA' ? 'Fuliza Boost' : 'Quick Loan'}, please retry the payment on the website.`;
        await sendFluxSMS(Msisdn, failMsg);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}