'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SendSMSPage() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !message) {
      toast.error('Missing fields', {
        description: 'Please enter both phone number and message.',
      });
      return;
    }

    if (message.length > 160) {
      toast.error('Message too long', {
        description: 'Maximum 160 characters allowed.',
      });
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send SMS');
      }

      toast.success('SMS Sent!', {
        description: `Message sent to ${data.phone}. Cost: ${data.cost} KES`,
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

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Send SMS via FluxSMS</CardTitle>
          <CardDescription>
            Enter a Kenyan phone number and your message (max 160 chars).
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
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSending}
              />
              <p className="text-xs text-muted-foreground">
                Kenyan format: 07XXXXXXXX or 2547XXXXXXXX
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <span className={`text-xs ${message.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {message.length}/160
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="Hello from FluxSMS!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={161}
                disabled={isSending}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSending ? 'Sending...' : 'Send SMS'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}