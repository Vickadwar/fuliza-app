'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Menu, X, ShieldCheck, Clock, 
  Sprout, Bike, Store, ArrowRight, 
  Banknote, Loader2, Phone, UserCheck, 
  TrendingUp, CheckCircle2, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// --- MOCK DATA FOR POPUPS ---
const POPUP_DATA = [
  { name: "John Kamau", loc: "Roysambu", action: "boost", amount: "12,000" },
  { name: "Sarah Wanjiku", loc: "Thika", action: "loan", amount: "3,500" },
  { name: "Kevin Otieno", loc: "Kisumu", action: "boost", amount: "25,000" },
  { name: "Mercy Chebet", loc: "Eldoret", action: "loan", amount: "8,000" },
  { name: "Brian Mwangi", loc: "Nakuru", action: "boost", amount: "7,500" },
  { name: "Halima Ali", loc: "Mombasa", action: "loan", amount: "15,000" },
  { name: "David Mutua", loc: "Machakos", action: "boost", amount: "45,000" },
];

export default function HomePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'fuliza' | 'loan'>('fuliza')
  
  // Form Inputs
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')

  // --- SMART POPUP STATE ---
  const [popup, setPopup] = useState({ visible: false, data: POPUP_DATA[0] })
  
  // Date Formatter (e.g., "19 Jan")
  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  // Popup Logic Loop
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      // 1. Hide current
      setPopup(prev => ({ ...prev, visible: false }));
      
      // 2. Wait 500ms, update data, show new
      setTimeout(() => {
        index = (index + 1) % POPUP_DATA.length;
        setPopup({ visible: true, data: POPUP_DATA[index] });
      }, 500);

    }, 6000); // Change every 6 seconds

    // Initial show
    setTimeout(() => setPopup(prev => ({ ...prev, visible: true })), 1000);

    return () => clearInterval(interval);
  }, []);

  // Constants
  const safaricomGreen = 'bg-[#00A529] hover:bg-[#008f24]'
  const safaricomText = 'text-[#00A529]'

  // Dynamic Content Objects
  const content = {
    fuliza: {
      headline: "Increase your Fuliza Limit",
      subhead: "Stuck with a 0 or 500 bob limit? We analyze your M-Pesa statement to unlock your true overdraft potential.",
      inputLabel: "Desired New Limit",
      btnText: "Check Eligibility",
      steps: [
        { title: "Enter Number", desc: "Use your active Safaricom line." },
        { title: "Scan Statement", desc: "System checks your M-Pesa usage history." },
        { title: "Limit Unlocked", desc: "New limit reflects within 24 hours." }
      ],
      targets: [
        { icon: <Store className="w-6 h-6" />, title: "Shop Owners", desc: "Don't get stranded at the till when paying suppliers." },
        { icon: <TrendingUp className="w-6 h-6" />, title: "Heavy M-Pesa Users", desc: "Your transactions justify a higher limit. Get what you deserve." }
      ]
    },
    loan: {
      headline: "Instant M-Pesa Cash",
      subhead: "Emergency cash sent directly to your phone. No paperwork, no guarantors, just trust.",
      inputLabel: "Loan Amount",
      btnText: "Apply Now",
      steps: [
        { title: "Request Cash", desc: "Select how much you need right now." },
        { title: "Auto-Approval", desc: "System verifies your ID and CRB status." },
        { title: "Receive M-Pesa", desc: "Money sent instantly upon approval." }
      ],
      targets: [
        { icon: <Bike className="w-6 h-6" />, title: "Boda Boda Riders", desc: "Sort bike repairs, fuel, or fines instantly." },
        { icon: <Sprout className="w-6 h-6" />, title: "Farmers", desc: "Buy fertilizer and seeds now, pay after harvest." }
      ]
    }
  }

  const currentContent = activeTab === 'fuliza' ? content.fuliza : content.loan;

  const handleProcess = () => {
    if(!phoneNumber || !amount) return;
    setIsLoading(true)
    setTimeout(() => {
      if (activeTab === 'fuliza') router.push('/fuliza');
      else router.push('/quick-loans');
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900 pb-20 relative overflow-x-hidden">
      
      {/* --- SMART FLOATING POPUP --- */}
      <div className={`fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 z-50 transition-all duration-500 transform ${popup.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white rounded-lg shadow-xl border-l-4 border-[#00A529] p-3 flex items-center gap-3 ring-1 ring-black/5">
          <div className="bg-green-100 rounded-full p-2 shrink-0">
             {popup.data.action === 'boost' ? <TrendingUp className="w-5 h-5 text-[#00A529]" /> : <Banknote className="w-5 h-5 text-[#00A529]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-slate-800 truncate">{popup.data.name}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                 <Clock className="w-3 h-3" /> Just now
              </p>
            </div>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
               <MapPin className="w-3 h-3" /> {popup.data.loc}
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                {popup.data.action === 'boost' ? 'New Limit:' : 'Received:'}
              </span>
              <span className="text-sm font-black text-[#00A529]">
                KES {popup.data.amount}
              </span>
            </div>
          </div>
        </div>
        <div className="text-[9px] text-center text-slate-400 mt-1 font-medium">
           Live Feed • {getTodayDate()}
        </div>
      </div>
      {/* --------------------------- */}

      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Fluxx<span className={safaricomText}>Pesa</span>
            </span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container mx-auto px-4 pt-6 max-w-md pb-24">
        
        {/* TAB SWITCHER */}
        <div className="bg-white p-1 rounded-lg border border-gray-300 flex mb-6 shadow-sm">
            <button 
                onClick={() => setActiveTab('fuliza')}
                className={`flex-1 py-3 text-sm font-bold rounded flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'fuliza' ? `${safaricomGreen} text-white` : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <TrendingUp className="w-4 h-4" /> Fuliza Limit
            </button>
            <button 
                onClick={() => setActiveTab('loan')}
                className={`flex-1 py-3 text-sm font-bold rounded flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'loan' ? `${safaricomGreen} text-white` : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <Banknote className="w-4 h-4" /> Quick Loan
            </button>
        </div>

        {/* HERO TEXT */}
        <div className="text-center mb-6 px-2">
            <h1 className="text-2xl font-black text-slate-900 mb-2">
                {currentContent.headline}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
                {currentContent.subhead}
            </p>
        </div>

        {/* APPLICATION CARD */}
        <Card className="border border-gray-200 shadow-sm bg-white rounded-lg mb-8">
            <CardContent className="p-6">
                
                {/* Phone Input */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">M-Pesa Number</label>
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-100 border-r border-gray-200 rounded-l-md flex items-center justify-center">
                            <Phone className="h-4 w-4 text-gray-500" />
                        </div>
                        <input 
                            type="tel" 
                            placeholder="07XX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full pl-12 h-11 bg-white border border-gray-300 rounded-md text-sm font-bold text-slate-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />
                    </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        {currentContent.inputLabel} (KES)
                    </label>
                    <input 
                        type="number" 
                        placeholder="e.g. 5,000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-4 h-11 bg-white border border-gray-300 rounded-md text-lg font-bold text-slate-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 mb-2"
                    />
                    
                    {/* Quick Select Chips */}
                    <div className="flex gap-2">
                        {['3,000', '5,000', '10,000'].map((val) => (
                            <button 
                                key={val}
                                onClick={() => setAmount(val.replace(',',''))}
                                className="flex-1 py-1 text-xs font-medium border border-gray-200 bg-gray-50 text-slate-600 rounded hover:border-green-600 hover:text-green-600"
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <Button 
                    onClick={handleProcess}
                    disabled={isLoading || !phoneNumber || !amount}
                    className={`w-full h-12 text-base font-bold rounded-md shadow-none ${safaricomGreen} text-white opacity-100 disabled:opacity-70`}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" /> Processing...
                        </div>
                    ) : (
                        <span className="flex items-center gap-2">
                            {currentContent.btnText} <ArrowRight className="w-4 h-4" />
                        </span>
                    )}
                </Button>
                
                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600" /> Secure</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-green-600" /> Instant</span>
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3 text-green-600" /> Private</span>
                </div>
            </CardContent>
        </Card>

        {/* DYNAMIC: WHO IS THIS FOR? */}
        <section className="mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 pl-1">
                Who is this for?
            </h3>
            <div className="space-y-3">
                {currentContent.targets.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-lg border border-gray-200">
                        <div className="p-2 rounded bg-green-50 text-green-700 shrink-0">
                            {item.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-tight">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* DYNAMIC: HOW IT WORKS */}
        <section className="pb-8">
             <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 pl-1">
                How it works
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                    {currentContent.steps.map((step, i) => (
                        <div key={i} className="relative pl-8">
                            <div className={`absolute left-0 top-0 h-6 w-6 rounded-full border-2 border-white ${safaricomGreen} text-white text-[10px] font-bold flex items-center justify-center ring-1 ring-gray-100`}>
                                {i + 1}
                            </div>
                            <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                            <p className="text-xs text-slate-500">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="py-6 text-center border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 max-w-md">
            <p className="text-xs text-slate-400 mb-2">&copy; 2024 FluxxPesa Kenya.</p>
            <p className="text-[10px] text-slate-300">
                Authorized Digital Credit Provider. <br/>
                Interest rates and transaction fees may apply.
            </p>
        </div>
      </footer>
    </div>
  )
}