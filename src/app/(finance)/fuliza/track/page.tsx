'use client';

import React, { useState } from 'react';
import { Search, Lock, Terminal, CheckCircle2, Loader2, Server, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeTrackingId } from '@/lib/loan-engine';
import Link from 'next/link';

export default function FulizaTrackingPage() {
  const [refCode, setRefCode] = useState('');
  const [uiState, setUiState] = useState<'input' | 'scanning' | 'result_pending' | 'result_success' | 'invalid'>('input');
  
  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refCode) return;
    setUiState('scanning');

    setTimeout(() => {
       const status = analyzeTrackingId(refCode);
       
       if (!status.valid) {
           setUiState('invalid');
       } else if (status.ageInHours >= 48) {
           setUiState('result_success');
       } else {
           setUiState('result_pending');
       }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-emerald-950 text-emerald-50 p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
         <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div><span className="font-mono font-bold tracking-widest text-xs">SYSTEM STATUS: ONLINE</span></div>
         <Link href="/fuliza" className="font-bold text-xs opacity-80 hover:text-white">BACK</Link>
      </div>

      <div className="max-w-md mx-auto p-4 pt-10">
         {uiState === 'input' && (
            <div className="animate-in slide-in-from-bottom-4">
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100"><Terminal className="w-8 h-8 text-emerald-700" /></div>
                  <h1 className="text-2xl font-black text-slate-900 mb-2">Limit Status Check</h1>
                  <p className="text-slate-500 text-sm">Enter your Tracking ID (e.g. FZ-1801...)</p>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                  <form onSubmit={handleScan} className="space-y-4">
                     <input type="text" className="w-full h-14 px-4 border border-slate-300 rounded-xl font-mono text-lg font-bold uppercase focus:ring-2 focus:ring-emerald-600 outline-none text-center tracking-widest" placeholder="FZ-XXXX-Q-XXX" value={refCode} onChange={(e) => setRefCode(e.target.value)} />
                     <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg">Scan System</Button>
                  </form>
               </div>
            </div>
         )}

         {uiState === 'scanning' && (
            <div className="text-center pt-20">
               <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <Server className="absolute inset-0 m-auto w-8 h-8 text-emerald-600" />
               </div>
               <h2 className="text-lg font-bold text-slate-900 mb-2">Syncing with Safaricom...</h2>
               <p className="text-xs text-slate-500 font-mono">Pinging Ref: {refCode}</p>
            </div>
         )}

         {uiState === 'result_pending' && (
            <div className="animate-in zoom-in-95 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-emerald-600 p-4 text-white flex justify-between"><span className="font-bold text-xs uppercase">Sync in Progress</span><Loader2 className="w-4 h-4 animate-spin" /></div>
                <div className="p-6">
                    <div className="flex gap-4 mb-6"><RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" /><div><h3 className="font-bold text-slate-900">Database Propagation</h3><p className="text-xs text-slate-500">Your limit is currently synchronizing with the M-Pesa core network.</p></div></div>
                    <div className="bg-slate-100 p-4 rounded-xl mb-6"><div className="flex justify-between text-xs mb-2"><span>Estimated Completion:</span><span className="font-bold">48 Hours</span></div><div className="w-full bg-slate-300 h-2 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[65%] animate-pulse"></div></div></div>
                    <Button onClick={() => setUiState('input')} variant="outline" className="w-full">Check Later</Button>
                </div>
            </div>
         )}

         {uiState === 'result_success' && (
            <div className="animate-in zoom-in-95 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-4 text-white flex justify-between"><span className="font-bold text-xs uppercase">Process Completed</span><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
                <div className="p-6">
                    <div className="text-center mb-6"><h3 className="text-xl font-black text-slate-900">Limit Approved</h3><p className="text-sm text-emerald-600 font-bold">Disbursement Flag: TRUE</p></div>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-left">
                        <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-yellow-600" /><h4 className="text-sm font-bold text-slate-900">Limit Not Reflecting?</h4></div>
                        <p className="text-xs text-slate-600 mb-3">If you do not see the new limit on *234#, your line may need a manual refresh:</p>
                        <div className="bg-white p-3 rounded border border-yellow-100 text-xs text-slate-700 space-y-2 font-medium"><p>1. Dial <span className="font-bold">*234#</span></p><p>2. Select <span className="font-bold">Fuliza M-Pesa</span></p><p>3. Select <span className="font-bold">Opt Out</span></p><p>4. Wait 5 minutes.</p><p>5. Dial *234# and <span className="font-bold">Opt In</span> again.</p></div>
                    </div>
                    <Button onClick={() => setUiState('input')} className="w-full bg-slate-900 text-white">Done</Button>
                </div>
            </div>
         )}
         
         {uiState === 'invalid' && (
            <div className="text-center pt-10 animate-in shake">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Terminal className="w-8 h-8 text-red-600" /></div>
                <h2 className="text-xl font-bold text-slate-900">Invalid ID</h2>
                <p className="text-slate-500 text-sm mb-6">The code {refCode} does not exist.</p>
                <Button onClick={() => setUiState('input')} variant="outline">Try Again</Button>
            </div>
         )}
      </div>
    </div>
  );
}