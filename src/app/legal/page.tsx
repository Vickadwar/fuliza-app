'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Scale, 
  Lock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Zap,
  Menu,
  X,
  CreditCard,
  Server,
  Eye,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function LegalPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- HEADER (Glassmorphism) --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-3">
            <Link href="/" className="group h-9 w-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
            </Link>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-slate-900 leading-none">
                FulizaBoost
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Legal Center
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-xs font-bold text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <Link href="/fuliza" className="hover:text-slate-900 transition-colors">Products</Link>
              <Link href="#" className="text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full">Legal</Link>
            </nav>
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-700">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-16 pb-20 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-40 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full blur-[100px] mix-blend-multiply"></div>
            <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-200 rounded-full blur-[100px] mix-blend-multiply"></div>
        </div>

        <div className="relative container mx-auto px-4 max-w-3xl text-center z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Globe className="w-3 h-3 text-blue-500" />
                <span>Global Compliance Standards</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
               Transparency first. <br/>
               <span className="text-slate-400">Always.</span>
            </h1>
            
            <p className="text-slate-500 font-medium text-base leading-relaxed max-w-lg mx-auto mb-8">
                We believe financial tools should be simple and the rules governing them even simpler. 
            </p>

            <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-2 text-xs font-medium text-slate-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Last updated: <span className="text-slate-900 font-bold">January 15, 2026</span>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="container mx-auto px-4 max-w-3xl pb-24 -mt-6">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            
            {/* STICKY TAB NAV */}
            <div className="sticky top-20 z-30 mb-8 backdrop-blur-xl bg-white/50 p-1.5 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 mx-auto max-w-md">
                <TabsList className="grid grid-cols-2 w-full h-auto bg-transparent p-0 gap-1">
                    <TabsTrigger 
                        value="terms" 
                        className="h-10 rounded-xl text-xs font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                    >
                        Terms of Service
                    </TabsTrigger>
                    <TabsTrigger 
                        value="privacy" 
                        className="h-10 rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                    >
                        Privacy Policy
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* --- TERMS CONTENT --- */}
            <TabsContent value="terms" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* TL;DR CARD */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Zap className="h-4 w-4 fill-current" />
                        </div>
                        <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide">At a Glance</h3>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-3">
                        <li className="flex gap-2 text-xs font-medium text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>Fees are for "Profile Assessment" only.</span>
                        </li>
                        <li className="flex gap-2 text-xs font-medium text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>Limit increases are not guaranteed.</span>
                        </li>
                        <li className="flex gap-2 text-xs font-medium text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>Payments are non-refundable.</span>
                        </li>
                        <li className="flex gap-2 text-xs font-medium text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>We are not a bank.</span>
                        </li>
                    </ul>
                </div>

                {/* SECTIONS */}
                <LegalSection number="01" title="Service Description">
                    <p>
                        FulizaBoost is a data analytics platform. We do not lend money directly. We provide an <span className="font-bold text-slate-900">Algorithmic Profile Optimization</span> service that analyzes your M-Pesa transaction history to generate a credit score report, which is then submitted to lending partners (e.g., NCBA, Safaricom) for consideration of a limit increase.
                    </p>
                </LegalSection>

                <LegalSection number="02" title="Fees & Payments">
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 my-4 rounded-r-lg">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-orange-900 text-xs uppercase mb-1">Non-Refundable Policy</h4>
                                <p className="text-xs text-orange-800 leading-relaxed">
                                    The Service Fee covers the computational cost of real-time credit scoring. Once the analysis is triggered, this resource is consumed. Therefore, <strong>all fees are final and non-refundable</strong>, regardless of whether your limit is successfully increased.
                                </p>
                            </div>
                        </div>
                    </div>
                    <p>
                        Payments are processed via Safaricom M-Pesa STK Push. By entering your PIN, you authorize the specific transaction amount for the service "Credit Score Generation".
                    </p>
                </LegalSection>

                <LegalSection number="03" title="User Obligations">
                    <p>You agree to:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-slate-400">
                        <li>Provide a valid phone number registered in your name.</li>
                        <li>Not use the service for fraudulent purposes or identity theft.</li>
                        <li>Accept that CRB-listed accounts may be automatically rejected by the algorithm.</li>
                    </ul>
                </LegalSection>

                <LegalSection number="04" title="Disclaimer">
                    <p>
                        FulizaBoost is an independent entity and is not a subsidiary of Safaricom PLC or NCBA Bank. Limit decisions are made by the lender's automated systems, which we influence via data submission but do not control.
                    </p>
                </LegalSection>

            </TabsContent>

            {/* --- PRIVACY CONTENT --- */}
            <TabsContent value="privacy" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className="bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100 p-6 rounded-2xl">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">Data Safety</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        We treat your data like money. It is encrypted, restricted, and never sold.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white border-slate-200 text-slate-600">256-bit Encryption</Badge>
                        <Badge variant="secondary" className="bg-white border-slate-200 text-slate-600">GDPR Compliant</Badge>
                        <Badge variant="secondary" className="bg-white border-slate-200 text-slate-600">Auto-Deletion</Badge>
                    </div>
                </div>

                <LegalSection number="01" title="Data Collection" icon={Server}>
                    <p>To perform the analysis, we process the following data points:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <DataCard icon={CreditCard} title="Transaction Volume" desc="Sum of M-Pesa deposits/withdrawals." />
                        <DataCard icon={Zap} title="Overdraft History" desc="Frequency of previous Fuliza usage." />
                    </div>
                </LegalSection>

                <LegalSection number="02" title="Use of Information" icon={Eye}>
                    <p>
                        We do not sell your personal information. Your data is used exclusively to:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2 marker:text-slate-400 marker:font-bold">
                        <li>Verify your identity against the National ID database.</li>
                        <li>Calculate your "Affordability Score".</li>
                        <li>Communicate transaction status via SMS.</li>
                    </ol>
                </LegalSection>

                <LegalSection number="03" title="Security Measures" icon={Lock}>
                    <p>
                        All transmission of data between your device and our servers is protected using TLS 1.3 encryption. Sensitive fields (like ID numbers) are hashed in our database. We do not store your M-Pesa PIN at any time.
                    </p>
                </LegalSection>

            </TabsContent>
        </Tabs>

        {/* --- FOOTER CTA --- */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
             
             <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                    Our compliance team is ready to help explain any part of our policies.
                </p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" className="bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:text-white">
                        Contact Support
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0">
                        View FAQs
                    </Button>
                </div>
             </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-10 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-black text-slate-900">FulizaBoost</span>
                </div>
                <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
                    Empowering Kenyans with data-driven financial limits. 
                    <br />Secure, fast, and transparent.
                </p>
            </div>
            <div className="flex gap-8 md:justify-end">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide">Legal</span>
                    <a href="#" className="text-xs text-slate-500 hover:text-blue-600">Privacy</a>
                    <a href="#" className="text-xs text-slate-500 hover:text-blue-600">Terms</a>
                </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide">Product</span>
                    <a href="/fuliza" className="text-xs text-slate-500 hover:text-blue-600">Boost Limit</a>
                    <a href="#" className="text-xs text-slate-500 hover:text-blue-600">Quick Loan</a>
                </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-400 font-bold">&copy; 2026 FulizaBoost Analytics Ltd.</p>
            <div className="flex gap-4">
                <Lock className="w-3 h-3 text-slate-300" />
                <ShieldCheck className="w-3 h-3 text-slate-300" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function LegalSection({ number, title, icon: Icon, children }: any) {
    return (
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-xs font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{number}</span>
                    {title}
                </h2>
                {Icon && <Icon className="w-5 h-5 text-slate-400" />}
            </div>
            <div className="text-sm text-slate-600 leading-7 font-medium">
                {children}
            </div>
        </section>
    );
}

function DataCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <div className="text-xs font-bold text-slate-900">{title}</div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{desc}</div>
            </div>
        </div>
    )
}