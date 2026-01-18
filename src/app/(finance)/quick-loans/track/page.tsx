'use client';

import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Clock, FileText, CheckCircle2, 
  Loader2, AlertTriangle, ArrowLeft, MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeTrackingId } from '@/lib/loan-engine';
import Link from 'next/link';

export default function ProductionTrackingPage() {
  const [trackId, setTrackId] = useState('');
  const [status, setStatus] = useState<'input' | 'searching' | 'result'>('input');
  const [data, setData] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setStatus('searching');

    // Simulate Network Query (2s delay for realism)
    setTimeout(() => {
      const analysis = analyzeTrackingId(trackId);
      setData(analysis);
      setStatus('result');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* HEADER */}
      <div className="bg-slate-900 text-white p-3 flex justify-between items-center shadow-md sticky top-0 z-50">
         <div className="flex items-center gap-3">
            <Link href="/quick-loans" className="p-1 hover:bg-slate-800 rounded transition-colors">
               <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold tracking-tight text-sm">Loan Tracker</span>
         </div>
         <Link href="/quick-loans/chat" className="text-[10px] font-bold uppercase tracking-wide opacity-80 flex items-center gap-1 hover:text-emerald-400 transition-colors">
            <MessageSquare className="w-3 h-3" /> Help
         </Link>
      </div>

      <div className="max-w-md mx-auto p-4 pt-10">
        
        {/* === INPUT STATE === */}
        {status === 'input' && (
          <div className="animate-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
               <h1 className="text-2xl font-black text-slate-900 mb-2">Track Application</h1>
               <p className="text-slate-500 text-sm">Enter the Tracking ID from your receipt or SMS.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
               <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Tracking ID</label>
                     <div className="relative">
                        <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-xl font-mono text-lg font-bold uppercase focus:ring-2 focus:ring-blue-900 outline-none placeholder:text-slate-300"
                          placeholder="LN-XXXX-XXXX"
                          value={trackId}
                          onChange={(e) => setTrackId(e.target.value)}
                        />
                     </div>
                  </div>
                  <Button className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg">
                     Check Status
                  </Button>
               </form>
            </div>
          </div>
        )}

        {/* === SEARCHING STATE === */}
        {status === 'searching' && (
           <div className="text-center pt-20">
              <div className="relative w-16 h-16 mx-auto mb-6">
                 <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Querying Database...</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {trackId}</p>
           </div>
        )}

        {/* === RESULT STATE === */}
        {status === 'result' && (
           <div className="animate-in zoom-in-95">
              
              {/* INVALID ID SCENARIO */}
              {!data?.valid ? (
                 <div className="text-center pt-10">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Not Found</h2>
                    <p className="text-slate-500 text-sm mb-6">The Tracking ID entered does not exist.</p>
                    <Button onClick={() => setStatus('input')} variant="outline">Try Again</Button>
                 </div>
              ) : (
                 /* VALID ID SCENARIO */
                 <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                       <span className="font-bold text-sm">File Found</span>
                       <ShieldCheck className="w-4 h-4 opacity-80" />
                    </div>
                    
                    <div className="p-6">
                       {/* FILE HEADER */}
                       <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                          <div>
                             <p className="text-xs font-bold text-slate-500 uppercase">Created</p>
                             <p className="text-sm font-bold text-slate-900">{data.dateString}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-slate-500 uppercase">Type</p>
                             <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold inline-block">
                                {data.type.toUpperCase()}
                             </div>
                          </div>
                       </div>

                       {/* TIMELINE LOGIC */}
                       <div className="space-y-6 relative">
                          <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                          {/* STEP 1: RECEIVED (Always Done) */}
                          <div className="relative flex gap-4">
                             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border-2 border-white z-10 shadow-sm">
                                <CheckCircle2 className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-900">Application Received</h4>
                                <p className="text-xs text-slate-500">Deposit verified.</p>
                             </div>
                          </div>

                          {/* STEP 2: UNDERWRITING (Active if < 48h, Done if > 48h) */}
                          <div className="relative flex gap-4">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white z-10 shadow-sm
                                ${data.ageInHours >= 48 
                                   ? 'bg-emerald-100 text-emerald-600' 
                                   : 'bg-blue-600 text-white animate-pulse'}`
                             }>
                                {data.ageInHours >= 48 ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                             </div>
                             <div>
                                <h4 className={`text-sm font-bold ${data.ageInHours >= 48 ? 'text-slate-900' : 'text-blue-700'}`}>
                                   Underwriting Review
                                </h4>
                                {data.ageInHours < 48 ? (
                                   <div className="text-xs text-slate-500">
                                      <p>Agent Sarah is reviewing your file.</p>
                                      <span className="bg-blue-50 text-blue-800 px-1 rounded mt-1 inline-block font-bold">Queue Position: #42</span>
                                   </div>
                                ) : (
                                   <p className="text-xs text-slate-500">Approved by Risk Team.</p>
                                )}
                             </div>
                          </div>

                          {/* STEP 3: DISBURSED (Active if > 48h) */}
                          <div className={`relative flex gap-4 ${data.ageInHours < 48 ? 'opacity-40' : ''}`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white z-10 shadow-sm
                                ${data.ageInHours >= 48 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`
                             }>
                                <FileText className="w-4 h-4" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-900">Funds Disbursed</h4>
                                <p className="text-xs text-slate-500">Transfer to M-Pesa initiated.</p>
                             </div>
                          </div>
                       </div>

                       {/* FOOTER MESSAGING */}
                       <div className="mt-8 pt-6 border-t border-slate-100">
                           {data.ageInHours < 48 ? (
                              <div className="flex gap-3 items-start bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                 <Clock className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                 <p className="text-xs text-yellow-800 leading-relaxed">
                                    <strong>Est. Time Remaining:</strong> {Math.ceil(48 - data.ageInHours)} Hours.<br/>
                                    We will notify you via SMS immediately upon completion.
                                 </p>
                              </div>
                           ) : (
                              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                                 <p className="text-xs font-bold text-slate-900 mb-1">Money not reflecting?</p>
                                 <p className="text-[10px] text-slate-600 leading-relaxed">
                                    Dial <strong>*234#</strong> to refresh your M-Pesa cache if the SMS has delayed. The funds have been released from our ledger.
                                 </p>
                              </div>
                           )}
                       </div>

                       <div className="mt-6 space-y-3">
                          <Link href="/quick-loans"><Button variant="outline" className="w-full h-12 rounded-xl font-bold">Check Another ID</Button></Link>
                          <Link href="/quick-loans/chat"><Button className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Chat with Agent</Button></Link>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
}