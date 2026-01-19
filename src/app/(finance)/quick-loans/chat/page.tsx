'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft, ExternalLink, Activity, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeTrackingId } from '@/lib/loan-engine';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'bot' | 'user';
  content: string | React.ReactNode; 
  timestamp?: string;
};

export default function QuickLoanChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'bot', 
      content: (
        <div>
          <p className="mb-3">Jambo! I am Your Virtual Loan Assistant.</p>
          <p className="mb-3">Please <strong>paste your Tracking ID</strong> (starts with <strong>LN-</strong>) to check your application status instantly.</p>
          <div className="pt-2 border-t border-slate-200/20">
            <Link href="/quick-loans/track" className="inline-flex items-center gap-2 text-xs font-bold underline decoration-dotted hover:text-blue-200 transition-colors">
              <Activity className="w-3 h-3" />
              Go to Visual Tracker
            </Link>
          </div>
        </div>
      )
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => { 
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // 1. User Message
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Bot Logic
    setTimeout(() => {
      const result = analyzeTrackingId(userMsg.content as string);
      let reply: React.ReactNode = "";

      if (!result.valid) {
        // INVALID ID RESPONSE
        reply = (
            <div>
                <p className="mb-2">I don't recognize that ID. It should look like <strong>LN-190112-Q-123</strong>.</p>
                <p className="text-xs opacity-90 mb-2">Please check the SMS we sent you.</p>
                <Link href="/quick-loans/track">
                    <Button variant="secondary" size="sm" className="h-7 text-xs bg-slate-100 text-blue-900 hover:bg-white border border-slate-200">
                        Open Visual Tracker <ExternalLink className="w-3 h-3 ml-1"/>
                    </Button>
                </Link>
            </div>
        );
      } else {
        const hours = result.ageInHours;
        const { dateString } = result;

        // SCENARIO A: Just Submitted (< 2 Hours)
        if (hours < 2) {
           reply = (
             <div>
                <p className="mb-2 font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded inline-block text-[10px] uppercase tracking-wide">Status: Queued</p>
                <p className="mb-2 text-sm">We received your application on <strong>{dateString}</strong>.</p>
                <p className="text-sm">It is currently being indexed by our AI underwriting system. Please allow ~2 hours for the initial review.</p>
             </div>
           );
        }
        // SCENARIO B: Underwriting (2 - 48 Hours)
        else if (hours < 48) {
           const left = Math.ceil(48 - hours);
           reply = (
             <div>
                <p className="mb-2 font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded inline-block text-[10px] uppercase border border-yellow-100">Status: Underwriting</p>
                <p className="mb-2 text-sm">Your file is currently with <strong>Agent Sarah</strong> for final approval.</p>
                <div className="bg-slate-50 p-2 rounded border border-slate-100 mb-2">
                    <p className="text-xs text-slate-600"><strong>Queue Position:</strong> #42</p>
                    <p className="text-xs text-slate-600"><strong>Est. Wait:</strong> {left} hours</p>
                </div>
                <Link href={`/quick-loans/track?id=${userMsg.content}`} className="text-xs underline block opacity-80 hover:text-blue-200">View Timeline Details</Link>
             </div>
           );
        } 
        // SCENARIO C: Approved (> 48 Hours)
        else {
           reply = (
             <div>
                <p className="mb-2 font-bold text-emerald-600 bg-white px-2 py-0.5 rounded inline-block border border-emerald-100 text-[10px] uppercase">Status: Disbursed</p>
                <p className="mb-2">Your loan was approved and funds released to M-Pesa.</p>
                <p className="text-xs bg-slate-100 p-2 rounded text-slate-700 border-l-2 border-slate-400">
                    <strong>Payment not seen?</strong><br/>
                    Dial *234# to refresh your M-Pesa balance cache.
                </p>
             </div>
           );
        }
      }

      // 3. Bot Message
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
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
       {/* HEADER */}
       <div className="bg-blue-950 text-white p-4 border-b border-blue-900 flex items-center gap-3 shadow-md sticky top-0 z-10">
          <Link href="/quick-loans"><ArrowLeft className="w-5 h-5 text-blue-100" /></Link>
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white ring-2 ring-blue-800"><Bot /></div>
          <div><h1 className="font-bold text-sm">Quick Loans Support</h1><p className="text-[10px] text-blue-300 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Online</p></div>
       </div>
       
       {/* MESSAGES */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50" ref={scrollRef}>
          {messages.map((m) => (
             <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-900 text-white rounded-tr-none shadow-md' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'}`}>
                  {m.content}
                </div>
             </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-1 pl-4">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          )}
       </div>
       
       {/* INPUT */}
       <div className="bg-white p-4 border-t border-slate-200 sticky bottom-0 safe-area-bottom">
          <form onSubmit={handleSend} className="flex gap-2">
             <div className="relative flex-1">
                <input className="w-full bg-slate-100 rounded-full pl-5 pr-4 h-12 outline-none text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all border border-transparent focus:bg-white" placeholder="Paste Tracking ID (LN-...)" value={input} onChange={e => setInput(e.target.value)} />
             </div>
             <Button className="w-12 h-12 rounded-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg shrink-0"><Send className="w-5 h-5 ml-0.5" /></Button>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Secure Banking Channel</p>
          </div>
       </div>
    </div>
  );
}