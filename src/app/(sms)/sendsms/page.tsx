'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Send, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SendSMSPage() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [smsCount, setSmsCount] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Validate Kenyan phone number
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, '');
    const kenyanRegex = /^(?:254|0)([17]\d{8})$/;
    return kenyanRegex.test(cleaned);
  };

  // Format phone number to 254xxx on blur
  const formatPhone = (value: string) => {
    let cleaned = value.replace(/\s/g, '');
    if (cleaned.startsWith('0') && cleaned.length >= 10) {
      cleaned = '254' + cleaned.slice(1);
    }
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (value && !validatePhone(value)) {
      setPhoneError('Enter a valid Kenyan number (e.g., 0712345678 or 254712345678)');
    } else {
      setPhoneError('');
    }
  };

  const handlePhoneBlur = () => {
    if (phone && validatePhone(phone)) {
      setPhone(formatPhone(phone));
    }
  };

  // Calculate SMS parts and cost
  useEffect(() => {
    const maxPerSms = 160;
    const parts = Math.ceil(message.length / maxPerSms);
    setSmsCount(parts);
    // Assuming 1 KES per SMS part (adjust according to FluxSMS pricing)
    setEstimatedCost(parts);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !message) {
      toast.error('Missing fields', {
        description: 'Please enter both phone number and message.',
      });
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Invalid phone number', {
        description: 'Please enter a valid Kenyan phone number.',
      });
      return;
    }

    setIsSending(true);

    try {
      const formattedPhone = formatPhone(phone);
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send SMS');
      }

      toast.success('SMS Sent!', {
        description: `Message sent to ${data.phone}. Cost: KES ${data.cost || estimatedCost}`,
      });

      // Clear form
      setPhone('');
      setMessage('');
    } catch (error: any) {
      toast.error('Send failed', {
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setPhone('');
    setMessage('');
    setPhoneError('');
  };

  const isFormValid = phone && message && validatePhone(phone) && message.length > 0;

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send SMS via FluxSMS
          </CardTitle>
          <CardDescription>
            Instantly send SMS to any Kenyan mobile number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </label>
              <Input
                id="phone"
                placeholder="0712345678 or 254712345678"
                value={phone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                disabled={isSending}
                className={phoneError ? 'border-red-500' : ''}
              />
              {phoneError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {phoneError}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Example: 0712345678 → 254712345678
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <span className={`text-xs font-mono ${
                  message.length > 160 ? 'text-yellow-600' : 'text-muted-foreground'
                }`}>
                  {message.length} / 160 chars
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="Hello from FluxSMS!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={480} // max 3 SMS parts
                disabled={isSending}
                className="resize-none"
              />
              {message.length > 160 && (
                <Alert variant="default" className="py-2 mt-1 bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-xs text-yellow-700">
                    Message exceeds 160 chars – will be split into {smsCount} SMS part(s).
                    Estimated cost: KES {estimatedCost}
                  </AlertDescription>
                </Alert>
              )}
              {message.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Maximum 160 characters per SMS. Longer messages split automatically.
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={isSending || (!phone && !message)}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSending}
                className="flex-1"
              >
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSending ? 'Sending...' : 'Send SMS'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
          <div>Powered by FluxSMS</div>
          <div>1 SMS = 160 chars</div>
        </CardFooter>
      </Card>
    </div>
  );
}