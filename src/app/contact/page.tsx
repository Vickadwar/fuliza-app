'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Menu, 
  X, 
  Zap,
  HelpCircle,
  Phone,
  ChevronDown,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- CUSTOM SELECT COMPONENT ---
const CustomSelect = ({ label, value, options, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={ref}>
        <label className="text-[11px] font-bold text-slate-500 tracking-wide">{label}</label>
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-12 px-4 flex items-center justify-between rounded-xl bg-slate-50 border transition-all ${
                    isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'
                }`}
            >
                <span className="text-sm font-bold text-slate-900">{value}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    {options.map((option: string) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                        >
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{option}</span>
                            {value === option && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [ticketId, setTicketId] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'General inquiry',
    message: ''
  });

  const categoryOptions = [
    'General inquiry',
    'Limit not updated',
    'Payment verification',
    'Loan application issue',
    'Report fraud'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.name || !formData.phone || !formData.message) return;
    
    setStatus('loading');
    
    // Simulate Backend Processing
    setTimeout(() => {
      setTicketId(`#TK-${Math.floor(1000 + Math.random() * 9000)}`);
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', category: 'General inquiry', message: '' });
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-3">
            <Link href="/" className="group h-9 w-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
            </Link>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-slate-900 leading-none">
                FulizaBoost
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide">
                Support
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-xs font-bold text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <Link href="/legal" className="hover:text-slate-900 transition-colors">FAQs</Link>
              <span className="text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full">Contact</span>
            </nav>
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-700">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-24 px-6 animate-in fade-in slide-in-from-top-5">
            <nav className="space-y-4">
              <Link href="/" className="block text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Home</Link>
              <Link href="/fuliza" className="block text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Products</Link>
              <Link href="/legal" className="block text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Legal</Link>
            </nav>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className="bg-slate-900 text-white pt-12 pb-24 relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-[10px] font-bold tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Agents online</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                How can we help?
            </h1>
            <p className="text-slate-400 font-medium max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                Facing issues with your limit update or payment? Our support team is available 24/7 to resolve technical discrepancies.
            </p>
         </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="container mx-auto px-4 max-w-5xl -mt-16 pb-20 relative z-20">
        <div className="grid md:grid-cols-12 gap-6">
            
            {/* LEFT COL: CONTACT INFO */}
            <div className="md:col-span-5 space-y-4">
                {/* WhatsApp Card */}
                <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-xl shadow-emerald-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageCircle className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Chat on WhatsApp</h3>
                        <p className="text-emerald-100 text-xs font-medium mb-4">Fastest response for payment verification.</p>
                        <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                            Start chat
                        </button>
                    </div>
                </div>

                {/* Email Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Email support</h3>
                            <p className="text-xs text-slate-500 font-medium">help@fulizaboost.co.ke</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Business hours</h3>
                            <p className="text-xs text-slate-500 font-medium">Mon - Fri, 8am - 6pm</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COL: CONTACT FORM */}
            <div className="md:col-span-7">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full min-h-[500px] flex flex-col">
                    
                    {status === 'success' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Message received!</h2>
                            <p className="text-slate-500 text-sm max-w-xs mb-6 leading-relaxed">
                                Ticket <span className="font-bold text-slate-900">{ticketId}</span> created. Our team will review your account and contact you via SMS within 2 hours.
                            </p>
                            
                            <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 text-left">
                                <h4 className="text-xs font-bold text-slate-900 mb-1">Summary:</h4>
                                <p className="text-xs text-slate-500">"{formData.message}"</p>
                            </div>

                            <Button onClick={handleReset} variant="outline" className="border-slate-200 font-bold hover:bg-slate-50">
                                Send another message
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Send a message</h2>
                                <p className="text-slate-500 text-xs font-medium mt-1">Fill the form below to open a support ticket.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 tracking-wide">Full name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 tracking-wide">Phone number</label>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-slate-200">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <input 
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({...formData, phone: val});
                                            }}
                                            className="w-full h-12 pl-16 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                            placeholder="07XX XXX XXX"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CUSTOM DROPDOWN COMPONENT */}
                            <CustomSelect 
                                label="Issue category"
                                value={formData.category}
                                options={categoryOptions}
                                onChange={(val: string) => setFormData({...formData, category: val})}
                            />

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 tracking-wide">Message details</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-300 resize-none"
                                    placeholder="Please describe your issue..."
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={status === 'loading'}
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all"
                            >
                                {status === 'loading' ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Send className="w-4 h-4" />
                                        <span>Submit ticket</span>
                                    </div>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-10 pb-12">
        <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-black text-slate-900">FulizaBoost</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mb-6">
                &copy; 2026 FulizaBoost Analytics Ltd. <br/> 
                <span className="font-normal opacity-70">Nairobi, Kenya.</span>
            </p>
        </div>
      </footer>

    </div>
  );
}