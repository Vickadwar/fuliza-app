'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft, ExternalLink, Activity } from 'lucide-react';
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
  // 2. INITIAL MESSAGE WITH TRACKING LINK
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'bot', 
      content: (
        <div>
          <p className="mb-3">Jambo! I am the Fuliza Support Assistant.</p>
          <p className="mb-3">Please <strong>paste your Tracking ID</strong> (starts with FZ-) to check your boost status.</p>
          <div className="pt-2 border-t border-slate-200/20">
            <Link href="/fuliza/track" className="inline-flex items-center gap-2 text-xs font-bold underline decoration-dotted hover:text-emerald-200 transition-colors">
              <Activity className="w-3 h-3" />
              Go to Visual Tracking Page
            </Link>
          </div>
        </div>
      )
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
        // INVALID ID RESPONSE
        reply = (
            <div>
                <p className="mb-2">I don't recognize that ID. It should look like <strong>FZ-1234...</strong></p>
                <p className="text-xs opacity-90">If you are having trouble, try using the standard tracker:</p>
                <Link href="/fuliza/track">
                    <Button variant="secondary" size="sm" className="mt-2 h-7 text-xs bg-slate-100 text-emerald-800 hover:bg-white border border-slate-200">
                        Open Tracker <ExternalLink className="w-3 h-3 ml-1"/>
                    </Button>
                </Link>
            </div>
        );
      } else {
        const hours = result.ageInHours;
        if (hours < 48) {
           const left = Math.ceil(48 - hours);
           reply = (
             <div>
                <p className="mb-2 font-bold text-yellow-600 bg-yellow-50 p-1 rounded inline-block text-xs uppercase">Syncing In Progress</p>
                <p className="mb-2 text-sm">Your Boost Request (Created: {result.dateString}) is syncing with the main database.</p>
                <p className="text-sm"><strong>Time remaining:</strong> {left} hours.</p>
                <Link href={`/fuliza/track?id=${userMsg.content}`} className="text-xs underline mt-2 block opacity-80">View Details in Tracker</Link>
             </div>
           );
        } else {
           reply = (
             <div>
                <p className="mb-2 font-bold text-emerald-600 bg-white px-2 py-0.5 rounded inline-block border border-emerald-100">Upgrade Completed</p>
                <p className="mb-2">Your limit boost has been pushed to the network.</p>
                <p className="text-xs bg-slate-100 p-2 rounded text-slate-700"><strong>Tip:</strong> If you don't see it, Dial *234# -&gt; Opt Out -&gt; Wait 5 mins -&gt; Opt In again.</p>
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
       <div className="bg-emerald-950 text-white p-4 border-b border-emerald-900 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <Link href="/fuliza"><ArrowLeft className="w-5 h-5 text-emerald-100" /></Link>
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white"><Bot /></div>
          <div><h1 className="font-bold text-sm">Fuliza Support</h1><p className="text-[10px] text-emerald-400 font-bold">● Automated</p></div>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((m) => (
             <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-700 text-white rounded-tr-none shadow-md' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'}`}>
                  {m.content}
                </div>
             </div>
          ))}
          {isTyping && <div className="text-xs text-slate-400 pl-4 animate-pulse">Typing...</div>}
       </div>
       
       <div className="bg-white p-4 border-t border-slate-200 sticky bottom-0">
          <form onSubmit={handleSend} className="flex gap-2">
             <input className="flex-1 bg-slate-100 rounded-full px-4 h-12 outline-none text-sm text-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Paste ID..." value={input} onChange={e => setInput(e.target.value)} />
             <Button className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg"><Send className="w-5 h-5" /></Button>
          </form>
       </div>
    </div>
  );
}