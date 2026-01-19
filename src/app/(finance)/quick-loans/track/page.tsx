'use client';

import React, { useState } from 'react';
import { 
  Search, ShieldCheck, CheckCircle2, Loader2, 
  Server, AlertTriangle, MessageSquare, 
  Home, ArrowLeft, HelpCircle, FileText, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeTrackingId } from '@/lib/loan-engine';
import Link from 'next/link';

// --- FLOATING CHAT COMPONENT ---
const FloatingChatFab = () => (
  <Link href="/quick-loans/chat">
    <div className="fixed bottom-6 right-4 z-50 animate-in zoom-in slide-in-from-bottom-10 duration-700">
      <div className="absolute -top-2 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] text-white items-center justify-center font-bold">1</span>
      </div>
      <button className="bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-white/10">
        <MessageSquare className="w-6 h-6" />
      </button>
      <div className="text-[10px] font-bold text-center mt-1 text-slate-500 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full shadow-sm">
        Support
      </div>
    </div>
  </Link>
);

export default function QuickLoanTrackingPage() {
  const [refCode, setRefCode] = useState('');
  const [uiState, setUiState] = useState<'input' | 'scanning' | 'result_pending' | 'result_success' | 'invalid'>('input');
  const [trackData, setTrackData] = useState<any>(null);
  
  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refCode) return;
    setUiState('scanning');

    setTimeout(() => {
       const status = analyzeTrackingId(refCode);
       setTrackData(status);
       
       if (!status.valid) {
           setUiState('invalid');
       } else if (status.ageInHours >= 48) {
           setUiState('result_success');
       } else {
           setUiState('result_pending');
       }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative">
      
      {/* FLOATING CHAT BUTTON */}
      <FloatingChatFab />

      {/* --- HEADER --- */}
      <div className="bg-blue-950 text-blue-50 p-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="font-mono font-bold tracking-widest text-xs">LOAN ENGINE: ONLINE</span>
         </div>
         <div className="flex items-center gap-4">
            <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity" title="Go Home">
                <Home className="w-5 h-5 text-blue-100" />
            </Link>
            <Link href="/quick-loans" className="font-bold text-xs opacity-80 hover:text-white flex items-center gap-1">
                BACK <ArrowLeft className="w-3 h-3" />
            </Link>
         </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-md mx-auto p-4 pt-10">
         
         {/* STATE: INPUT */}
         {uiState === 'input' && (
            <div className="animate-in slide-in-from-bottom-4">
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <Search className="w-8 h-8 text-blue-900" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 mb-2">Track Application</h1>
                  <p className="text-slate-500 text-sm">Enter the Tracking ID (starts with LN-)</p>
               </div>
               
               <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                  <form onSubmit={handleScan} className="space-y-4">
                     <input 
                        type="text" 
                        className="w-full h-14 px-4 border border-slate-300 rounded-xl font-mono text-lg font-bold uppercase focus:ring-2 focus:ring-blue-600 outline-none text-center tracking-widest placeholder:text-slate-300" 
                        placeholder="LN-XXXXXX-Q-XXX" 
                        value={refCode} 
                        onChange={(e) => setRefCode(e.target.value)} 
                     />
                     <Button className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg">
                        Locate File
                     </Button>
                  </form>
                  
                  {/* HELPER LINKS */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                    <Link href="/quick-loans/chat" className="text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium">
                        <HelpCircle className="w-3 h-3" /> Lost your ID?
                    </Link>
                    <Link href="/" className="text-blue-600 font-bold hover:underline">
                        Return Home
                    </Link>
                  </div>
               </div>
            </div>
         )}

         {/* STATE: SCANNING */}
         {uiState === 'scanning' && (
            <div className="text-center pt-20">
               <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <Server className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
               </div>
               <h2 className="text-lg font-bold text-slate-900 mb-2">Accessing Database...</h2>
               <p className="text-xs text-slate-500 font-mono">Querying ID: {refCode}</p>
            </div>
         )}

         {/* STATE: PENDING (Timeline View) */}
         {uiState === 'result_pending' && trackData && (
            <div className="animate-in zoom-in-95 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-blue-600 p-4 text-white flex justify-between"><span className="font-bold text-xs uppercase">File Found</span><Loader2 className="w-4 h-4 animate-spin" /></div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Date Received</p>
                            <p className="text-sm font-bold text-slate-900">{trackData.dateString}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">Processing</div>
                    </div>

                    {/* TIMELINE */}
                    <div className="space-y-6 relative ml-2">
                        <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-slate-200"></div>
                        
                        {/* Step 1: Done */}
                        <div className="relative flex gap-4">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white z-10 flex items-center justify-center shrink-0 shadow-sm">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Application Received</p>
                                <p className="text-xs text-slate-500">Deposit verified & file created.</p>
                            </div>
                        </div>

                        {/* Step 2: Active */}
                        <div className="relative flex gap-4">
                            <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white z-10 flex items-center justify-center shrink-0 animate-pulse shadow-sm">
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-700">Underwriting Review</p>
                                <p className="text-xs text-slate-600 mb-1">Assigned to Agent Sarah.</p>
                                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">Est: {Math.ceil(48 - trackData.ageInHours)} Hours Left</span>
                            </div>
                        </div>

                        {/* Step 3: Pending */}
                        <div className="relative flex gap-4 opacity-40">
                            <div className="w-6 h-6 bg-slate-200 rounded-full border-2 border-white z-10 flex items-center justify-center shrink-0">
                                <FileText className="w-3 h-3 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Disbursement</p>
                                <p className="text-xs text-slate-500">Pending approval.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button onClick={() => setUiState('input')} variant="outline" className="w-full">Check Another ID</Button>
                    </div>
                </div>
            </div>
         )}

         {/* STATE: SUCCESS */}
         {uiState === 'result_success' && trackData && (
            <div className="animate-in zoom-in-95 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-emerald-900 p-4 text-white flex justify-between"><span className="font-bold text-xs uppercase">Process Completed</span><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
                <div className="p-6">
                    <div className="text-center mb-6"><h3 className="text-xl font-black text-slate-900">Loan Approved</h3><p className="text-sm text-emerald-600 font-bold">Funds Released to M-Pesa</p></div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 border border-slate-100">
                        <div className="flex justify-between text-xs"><span className="text-slate-500">File ID:</span><span className="font-mono font-bold">{refCode}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Date:</span><span className="font-bold">{trackData.dateString}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-600 uppercase">Disbursed</span></div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-left">
                        <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-yellow-600" /><h4 className="text-sm font-bold text-slate-900">Don't see the cash?</h4></div>
                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">Sometimes M-Pesa SMS delays. Please manually refresh your balance:</p>
                        <div className="bg-white p-3 rounded border border-yellow-100 text-xs text-slate-700 font-medium">Dial <span className="font-bold">*234#</span> to force a balance update.</div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => setUiState('input')} className="flex-1 bg-slate-900 text-white">Done</Button>
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full">Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
         )}
         
         {/* STATE: INVALID */}
         {uiState === 'invalid' && (
            <div className="text-center pt-10 animate-in shake">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck className="w-8 h-8 text-red-600" /></div>
                <h2 className="text-xl font-bold text-slate-900">Invalid File ID</h2>
                <p className="text-slate-500 text-sm mb-6">The code <span className="font-mono font-bold bg-slate-100 px-1 rounded">{refCode}</span> was not found.</p>
                
                <div className="space-y-3">
                    <Button onClick={() => setUiState('input')} variant="outline" className="w-full border-slate-300">
                        Try Again
                    </Button>
                    <Link href="/quick-loans/chat">
                        <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white">
                            <MessageSquare className="w-4 h-4 mr-2" /> Chat with Support
                        </Button>
                    </Link>
                </div>
            </div>
         )}
      </div>
    </div>
  );
}