const FLUX_ENDPOINT = "https://api.fluxsms.co.ke/sendsms";

export async function sendFluxSMS(phone: string, message: string) {
  try {
    const cleanPhone = phone.replace(/\D/g, ''); // Ensure digits only
    
    // In Dev/Test, just log it to save credits
    if (process.env.NODE_ENV === 'development') {
        console.log(`[FluxSMS DEV] To: ${cleanPhone} | Msg: ${message}`);
        return { success: true };
    }

    const payload = {
      api_key: process.env.FLUX_API_KEY,
      sender_id: process.env.FLUX_SENDER_ID || "fluxsms",
      phone: cleanPhone,
      message: message
    };

    const res = await fetch(FLUX_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { success: data['response-code'] === 200, data };
  } catch (error) {
    console.error("[FluxSMS Error]", error);
    return { success: false };
  }
}