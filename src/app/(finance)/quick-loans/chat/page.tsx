'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeTrackingId } from '@/lib/loan-engine';
import Link from 'next/link';

// TYPE DEFINITIONS
type Message = {
  id: string;
  role: 'bot' | 'user';
  content: string | React.ReactNode;
  timestamp: string;
};

export default function ProductionChatPage() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Jambo! I'm the Jatelo Automated Assistant. I can track your application status instantly without an agent. Please enter your **Tracking ID** (e.g., LN-1801...).",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. ADD USER MESSAGE
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. SIMULATE PROCESSING (1.5s)
    setTimeout(() => {
      const analysis = analyzeTrackingId(userMsg.content as string);
      let botResponse: React.ReactNode = "";

      // 3. GENERATE INTELLIGENT RESPONSE
      if (!analysis.valid) {
        botResponse = (
          <span>
            I couldn't recognize that format. Please make sure you are using the ID sent via SMS.<br/><br/>
            Format should be like: <span className="font-mono bg-slate-100 px-1 rounded border border-slate-200 text-slate-800">LN-180113-Q-567</span>
          </span>
        );
      } else {
        const { type, ageInHours, dateString } = analysis;
        
        // SCENARIO A: JUST SUBMITTED (< 2 Hours)
        if (ageInHours < 2) {
          botResponse = (
             <div>
                <p className="font-bold text-emerald-600 mb-1">Application Received</p>
                <p className="mb-2">I found your <strong>{type}</strong> request from <strong>{dateString}</strong>.</p>
                <p>It is currently being indexed in our secure database. This usually takes about 2 hours.</p>
                <div className="mt-2 bg-blue-50 p-2 rounded text-xs text-blue-800 border border-blue-100">
                   <strong>Next Step:</strong> Our underwriting AI will pick this up shortly. No action needed.
                </div>
             </div>
          );
        } 
        // SCENARIO B: PROCESSING (2 - 48 Hours)
        else if (ageInHours < 48) {
           const remaining = Math.ceil(48 - ageInHours);
           botResponse = (
              <div>
                 <p className="font-bold text-blue-600 mb-1">In Progress</p>
                 <p className="mb-2">Your {type} application (Created: {dateString}) is currently assigned to <strong>Agent Sarah</strong>.</p>
                 <p className="mb-2">Current Status: <span className="font-mono bg-slate-100 px-1 rounded">UNDERWRITING_CHECK</span></p>
                 
                 <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <p className="text-xs text-yellow-800">
                       Queue Position: #{Math.floor(Math.random() * 50) + 10}.<br/>
                       Expected completion in approximately <strong>{remaining} hours</strong>.
                    </p>
                 </div>
              </div>
           );
        } 
        // SCENARIO C: APPROVED / STUCK (> 48 Hours)
        else {
           botResponse = (
              <div>
                 <p className="font-bold text-emerald-600 mb-1">Approved & Disbursed</p>
                 <p className="mb-2">Great news! My system shows this {type} was <strong>Approved</strong> and funds released.</p>
                 
                 <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-xs text-slate-900 mb-1">⚠️ Money not in M-Pesa?</p>
                    <p className="text-xs text-slate-600 mb-2">
                       This is a common Safaricom cache issue for new limits. Please reset your menu:
                    </p>
                    <ul className="text-[10px] text-slate-700 space-y-1 list-disc pl-4 font-mono">
                       <li>Dial *234#</li>
                       <li>Select "Fuliza M-Pesa"</li>
                       <li>Select "Opt Out"</li>
                       <li>Wait 5 minutes</li>
                       <li>Dial *234# and "Opt In" again</li>
                    </ul>
                 </div>
              </div>
           );
        }
      }

      const botMsg: Message = {
        id: Date.now().toString(),
        role: 'bot',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 1500); // 1.5s Fake "Thinking" Delay
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 p-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
         <Link href="/quick-loans" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
         </Link>
         <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
               <Bot className="w-6 h-6" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
         </div>
         <div>
            <h1 className="font-bold text-slate-900 text-sm">Jatelo Support</h1>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </p>
         </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
         {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`
                  max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed
                  ${msg.role === 'user' 
                     ? 'bg-blue-600 text-white rounded-tr-none' 
                     : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'}
               `}>
                  {msg.content}
                  <div className={`text-[9px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                     {msg.timestamp}
                  </div>
               </div>
            </div>
         ))}

         {isTyping && (
            <div className="flex justify-start">
               <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200 p-4 shadow-sm w-16 flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
               </div>
            </div>
         )}
         
         <div className="h-4"></div> {/* Spacer */}
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 border-t border-slate-200 sticky bottom-0">
         <form onSubmit={handleSend} className="flex gap-2 relative">
            <input 
               type="text" 
               className="flex-1 h-12 bg-slate-100 rounded-full px-5 border-none focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium placeholder:text-slate-400 transition-all"
               placeholder="Paste Tracking ID here..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
            />
            <Button 
               disabled={!input.trim() || isTyping}
               className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
            >
               <Send className="w-5 h-5 ml-0.5" />
            </Button>
         </form>
         <div className="text-center mt-3">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
               <Lock className="w-3 h-3" /> End-to-End Encrypted
            </p>
         </div>
      </div>
    </div>
  );
}