'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeTrackingId } from '@/lib/loan-engine';
import Link from 'next/link';

// 1. DEFINE THE TYPE EXPLICITLY
type Message = {
  id: string;
  role: 'bot' | 'user';
  // Allow content to be a string OR a React Component (JSX)
  content: string | React.ReactNode; 
  timestamp?: string;
};

export default function FulizaChatPage() {
  // 2. PASS THE TYPE TO USESTATE
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'bot', 
      content: "Jambo! I am the Fuliza Support Assistant. Paste your Tracking ID (FZ-...) to check your boost status." 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // 3. TYPED USER MESSAGE
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const result = analyzeTrackingId(userMsg.content as string);
      let reply: React.ReactNode = "";

      if (!result.valid) {
        reply = "I don't recognize that ID. Please ensure it starts with FZ- followed by the date code.";
      } else {
        const hours = result.ageInHours;
        if (hours < 48) {
           const left = Math.ceil(48 - hours);
           reply = `Your Boost Request (Created: ${result.dateString}) is currently syncing with the main database. This process takes 48 hours. Time remaining: ${left} hours.`;
        } else {
           reply = (
             <div>
                <p className="mb-2 font-bold text-emerald-600">Upgrade Completed</p>
                <p className="mb-2">Your limit boost has been pushed to the network.</p>
                <p className="text-xs bg-slate-100 p-2 rounded"><strong>Tip:</strong> If you don't see it, Dial *234# -&gt; Opt Out -&gt; Wait 5 mins -&gt; Opt In again. This refreshes the SIM menu.</p>
             </div>
           );
        }
      }

      // 4. TYPED BOT MESSAGE
      const botMsg: Message = { 
        id: Date.now().toString(), 
        role: 'bot', 
        content: reply 
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans">
       <div className="bg-emerald-950 text-white p-4 border-b border-emerald-900 flex items-center gap-3 shadow-sm sticky top-0">
          <Link href="/fuliza"><ArrowLeft className="w-5 h-5 text-emerald-100" /></Link>
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white"><Bot /></div>
          <div><h1 className="font-bold text-sm">Fuliza Support</h1><p className="text-[10px] text-emerald-400 font-bold">● Automated</p></div>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((m) => (
             <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-700 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'}`}>
                  {m.content}
                </div>
             </div>
          ))}
          {isTyping && <div className="text-xs text-slate-400 pl-4">Typing...</div>}
       </div>
       
       <div className="bg-white p-4 border-t border-slate-200 sticky bottom-0">
          <form onSubmit={handleSend} className="flex gap-2">
             <input className="flex-1 bg-slate-100 rounded-full px-4 h-12 outline-none text-sm" placeholder="Paste ID..." value={input} onChange={e => setInput(e.target.value)} />
             <Button className="w-12 h-12 rounded-full bg-emerald-700"><Send className="w-5 h-5" /></Button>
          </form>
       </div>
    </div>
  );
}