import React from 'react';
import { 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Star,
  CreditCard,
  BarChart,
  Target,
  Percent,
  Clock,
  RefreshCw,
  Users,
  Check,
  Wifi,
  Battery,
  Signal,
  Bell,
  MessageSquare,
  Wallet,
  Lock,
  Unlock,
  Gauge,
  ChevronLeft,
  Menu,
  History,
  Shield,
  Sliders,
  HelpCircle,
  Eye
} from 'lucide-react';

// --- TYPE DEFINITION ADDED HERE TO FIX THE ERROR ---
interface PhoneFrameProps {
  children: React.ReactNode;
  time?: string;
}

const PhoneFrame = ({ children, time = "9:41" }: PhoneFrameProps) => (
  <div className="relative w-[300px] h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl z-20 mx-auto">
    {/* Physical Buttons */}
    <div className="absolute top-24 -left-[10px] w-[2px] h-8 bg-slate-700 rounded-l"></div>
    <div className="absolute top-36 -left-[10px] w-[2px] h-14 bg-slate-700 rounded-l"></div>
    <div className="absolute top-28 -right-[10px] w-[2px] h-16 bg-slate-700 rounded-r"></div>

    {/* Screen Container */}
    <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative flex flex-col font-sans">
      {/* Status Bar */}
      <div className="h-10 bg-white flex items-end justify-between px-6 pb-2 z-20 relative flex-shrink-0">
        <span className="text-[10px] font-semibold text-slate-900">{time}</span>
        <div className="flex items-center gap-1">
          <Signal className="w-3 h-3 text-slate-900" />
          <Wifi className="w-3 h-3 text-slate-900" />
          <Battery className="w-3.5 h-3.5 text-slate-900" />
        </div>
      </div>
      
      {/* Dynamic Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-50 flex flex-col">
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full opacity-20 z-30"></div>
    </div>
  </div>
);

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Financial Freedom Cards</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Beautiful designs for your financial service marketing
          </p>
        </div>

        {/* --- SECTION 1: SQUARE CARDS --- */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Social Media Ready</h2>
            <p className="text-slate-500">Perfect 1:1 ratio cards for Instagram & Facebook</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
            {/* CARD 1: Limit Increase */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden relative flex flex-col w-full max-w-md mx-auto border border-slate-100">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-lg">Fuliza Limit Boost</span>
                      <div className="text-blue-100 text-xs">Fuliza Loans</div>
                    </div>
                  </div>
                  <div className="text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                    Popular
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Instant Processing</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-slate-800 mb-2">KES 25,000</div>
                    <div className="text-sm text-slate-500">Fuliza limit boost</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-slate-500 mb-1">Current Limit</div>
                      <div className="font-bold text-blue-700">KES 3,000</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-slate-500 mb-1">After Fuliza Boost</div>
                      <div className="font-bold text-emerald-700">12,500</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">No physical documents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">Mobile-first application</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">24/7 access</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                  Check Eligibility
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 2: Quick Cash Loan */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl overflow-hidden relative flex flex-col w-full max-w-md mx-auto border border-slate-100">
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-200 rounded-full blur-xl opacity-20"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-20"></div>
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-lg">Get Quick Cash</span>
                      <div className="text-emerald-100 text-xs">Instant Mobile Loans</div>
                    </div>
                  </div>
                  <div className="text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                    Mobile Loans
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-center relative z-10">
                <div className="text-center mb-8">
                  <div className="mb-6">
                    <div className="text-5xl font-bold text-slate-800 mb-2">KES 15,000</div>
                    <div className="text-sm text-slate-500">Instant loan amount</div>
                  </div>
                  
                  <div className="inline-flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Term</div>
                      <div className="font-bold text-emerald-700">30 Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Rate</div>
                      <div className="font-bold text-emerald-700">10%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Repay</div>
                      <div className="font-bold text-emerald-700">KES 16,500</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Disbursement time</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">2-4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Percent className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Approval rate</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Guarantor</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">Not required</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 relative z-10">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2">
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 3: Credit Building */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl overflow-hidden relative flex flex-col w-full max-w-md mx-auto border border-slate-100">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <BarChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-lg">Credit Builder</span>
                      <div className="text-purple-100 text-xs">Financial Growth</div>
                    </div>
                  </div>
                  <div className="text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                    Smart
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="text-center mb-6">
                  <div className="mb-8">
                    <div className="text-3xl font-bold text-slate-800 mb-4">Build Better Credit</div>
                    <p className="text-slate-600 text-sm">
                      Improve your financial profile with responsible usage patterns
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500">Current</div>
                      <div className="font-bold text-purple-700">Fair</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="text-xs text-slate-500">Potential</div>
                      <div className="font-bold text-purple-700">Good</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Timely payments tracking</div>
                      <div className="text-xs text-slate-500">Build positive history</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Limit increase opportunities</div>
                      <div className="text-xs text-slate-500">Based on performance</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Financial insights</div>
                      <div className="text-xs text-slate-500">Monthly progress reports</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2">
                  Start Building
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: LANDSCAPE BANNERS --- */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Website Banners</h2>
            <p className="text-slate-500">Horizontal layouts perfect for web headers</p>
          </div>
          
          <div className="space-y-10">
            {/* BANNER 1: Hero Banner */}
            <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              
              <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between">
                {/* Left Content */}
                <div className="lg:w-1/2 mb-10 lg:mb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-300 font-medium">Trusted & Secure</div>
                      <div className="text-2xl font-bold text-white">Digital Financial Services</div>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                    Financial solutions<br />
                    that work for<br />
                    <span className="text-blue-300">your lifestyle</span>
                  </h1>
                  
                  <p className="text-slate-300 text-lg mb-8 max-w-lg">
                    Access smart financial tools designed for modern mobile users. 
                    Simple, fast, and built around your needs.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                      Explore Services
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="bg-white/10 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                      How It Works
                    </button>
                  </div>
                </div>

                {/* Right Stats */}
                <div className="lg:w-2/5">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                      <div className="text-sm text-slate-300 mb-2">Average User Results</div>
                      <div className="text-4xl font-bold text-white mb-1">87%</div>
                      <div className="text-slate-300 text-sm">satisfaction rate</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-300">Quick Access</div>
                        <div className="font-semibold text-white">2-4 hours</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-slate-300">Digital Process</div>
                        <div className="font-semibold text-white">100% Online</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-slate-300">Support</div>
                        <div className="font-semibold text-white">24/7 Available</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-slate-300 text-sm ml-2">4.8/5 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BANNER 2: Features Grid */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Us</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Designed with your convenience and security in mind
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <Smartphone className="w-6 h-6 text-blue-600" />,
                    title: "Mobile First",
                    desc: "Access everything from your smartphone",
                    color: "from-blue-50 to-white"
                  },
                  {
                    icon: <Zap className="w-6 h-6 text-emerald-600" />,
                    title: "Fast Processing",
                    desc: "Quick decisions and disbursements",
                    color: "from-emerald-50 to-white"
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
                    title: "Secure & Private",
                    desc: "Bank-level security measures",
                    color: "from-purple-50 to-white"
                  },
                  {
                    icon: <CreditCard className="w-6 h-6 text-orange-600" />,
                    title: "No Hidden Fees",
                    desc: "Transparent pricing always",
                    color: "from-orange-50 to-white"
                  }
                ].map((feature, index) => (
                  <div key={index} className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-md`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-slate-50 flex items-center justify-center shadow-sm mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">
                  Learn more about our features
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: VERTICAL STORIES --- */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Story Format</h2>
            <p className="text-slate-500">Vertical layouts for Instagram & Facebook Stories</p>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-gradient-to-b from-slate-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden relative w-full max-w-sm min-h-[700px]">
              {/* Top Content */}
              <div className="p-8 pt-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                  Ready for<br />
                  <span className="text-blue-300">financial growth?</span>
                </h1>
                
                <div className="text-slate-300 text-base mb-8">
                  Take the first step toward better financial access
                </div>
              </div>
              
              {/* Steps */}
              <div className="px-6 space-y-6 mb-10">
                {[
                  {
                    step: "1",
                    title: "Simple Application",
                    desc: "Share basic details through our secure platform",
                    color: "bg-blue-500/20 border-blue-500/30"
                  },
                  {
                    step: "2",
                    title: "Instant Analysis",
                    desc: "Get personalized options in minutes",
                    color: "bg-emerald-500/20 border-emerald-500/30"
                  },
                  {
                    step: "3",
                    title: "Access Funds",
                    desc: "Quick disbursement to your preferred method",
                    color: "bg-purple-500/20 border-purple-500/30"
                  }
                ].map((step, index) => (
                  <div key={index} className={`${step.color} backdrop-blur-sm rounded-2xl p-5 border`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <div className="text-white font-bold">{step.step}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-lg">{step.title}</div>
                        <div className="text-slate-300 text-sm">{step.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center shadow-xl shadow-blue-600/30">
                  <div className="text-white text-2xl font-bold mb-3">Start Today</div>
                  <p className="text-blue-100 text-sm mb-6">
                    No commitment, just see what you qualify for
                  </p>
                  
                  <button className="w-full bg-white text-blue-700 font-bold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 mb-3">
                    Begin Free Assessment
                  </button>
                  
                  <div className="text-xs text-blue-200">
                    Takes only 2 minutes • No credit check required
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: 3D REALISTIC MOCKUP (Loan Approval) --- */}
        <div className="pb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Loan Approval</h2>
            <p className="text-slate-500">App Visualization for Instant Loans</p>
          </div>

          <div className="flex items-center justify-center min-h-[850px] w-full bg-gradient-to-tr from-slate-200 to-slate-100 rounded-3xl overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-300 rounded-full blur-[100px] opacity-20"></div>

            {/* CONTAINER */}
            <div className="relative flex justify-center items-center">
              
              {/* FLOATING CARD: Notification (Left) */}
              <div className="absolute -left-36 top-24 z-30 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 w-64">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-green-600/20">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center w-full mb-1">
                          <span className="text-xs font-bold text-slate-800">M-PESA</span>
                          <span className="text-[10px] text-slate-400">Now</span>
                        </div>
                        <div className="text-xs text-slate-600 leading-tight">
                          Confirmed. <span className="font-bold text-slate-900">KES 50,000</span> sent to your account.
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* FLOATING CARD: Credit Score (Right) */}
              <div className="absolute -right-32 bottom-32 z-30 animate-pulse">
                <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 flex items-center gap-4 w-56">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Credit Score</div>
                    <div className="text-lg font-bold text-slate-800 flex items-center gap-1">
                      785 <span className="text-emerald-500 text-xs font-medium bg-emerald-50 px-1.5 py-0.5 rounded">+15</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* THE PHONE */}
              <div className="relative w-[360px] h-[700px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl z-20">
                {/* Physical Buttons */}
                <div className="absolute top-24 -left-[10px] w-[2px] h-8 bg-slate-700 rounded-l"></div>
                <div className="absolute top-36 -left-[10px] w-[2px] h-14 bg-slate-700 rounded-l"></div>
                <div className="absolute top-28 -right-[10px] w-[2px] h-16 bg-slate-700 rounded-r"></div>

                {/* Screen Container */}
                <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative flex flex-col">
                  {/* Status Bar */}
                  <div className="h-12 bg-white flex items-end justify-between px-6 pb-2 z-20 relative flex-shrink-0">
                    <span className="text-xs font-semibold text-slate-900">9:41</span>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl"></div>
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3 text-slate-900" />
                      <Wifi className="w-3 h-3 text-slate-900" />
                      <Battery className="w-4 h-4 text-slate-900" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-5 py-3 flex items-center justify-between bg-white z-10 border-b border-slate-50 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                    </div>
                    <span className="font-semibold text-slate-800">Application Status</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>

                  {/* Main Screen Content */}
                  <div className="flex-1 bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 p-5 flex flex-col relative overflow-hidden">
                    {/* Confetti */}
                    <div className="absolute top-4 left-10 w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
                    <div className="absolute top-10 right-10 w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
                    
                    {/* Success Icon */}
                    <div className="text-center mt-2 mb-3 flex-shrink-0">
                      <div className="relative inline-block mb-2">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center relative z-10 shadow-emerald-200/50 shadow-lg">
                          <Check className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-30"></div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Loan Approved!</h3>
                      <p className="text-slate-500 text-xs">Funds processed successfully.</p>
                    </div>

                    {/* Details Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-slate-100 mb-auto mx-1">
                      <div className="text-center border-b border-slate-100 pb-2 mb-3">
                        <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Total Approved</span>
                        <div className="text-3xl font-bold text-slate-800 mt-1">
                          <span className="text-sm align-top text-slate-500 font-medium mr-1">KES</span>
                          50,000
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Interest</span>
                          <span className="font-semibold text-emerald-600">8%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Duration</span>
                          <span className="font-semibold text-slate-700">3 Months</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Due Date</span>
                          <span className="font-semibold text-slate-700">Apr 24, 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2.5 mt-4 flex-shrink-0 z-20 relative">
                      <button className="w-full bg-slate-900 text-white font-medium text-sm h-11 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-transform">
                        <Wallet className="w-4 h-4" />
                        Withdraw to M-PESA
                      </button>
                      <button className="w-full bg-white text-slate-700 font-medium text-sm h-11 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm active:scale-[0.98]">
                        View Repayment Plan
                      </button>
                    </div>
                  </div>

                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-30 pointer-events-none z-40" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

       {/* --- SECTION 5: COMPACT & REALISTIC APP REPLICA --- */}
        <div className="pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Fuliza Limit Increase</h2>
            <p className="text-slate-500">Helping you unlock your financial potential</p>
          </div>

          <div className="flex items-center justify-center min-h-[850px] w-full bg-gradient-to-tl from-emerald-50 to-green-50 rounded-3xl overflow-hidden relative">
             {/* Background Decor */}
             <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-200 rounded-full blur-[120px] opacity-30"></div>
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-200 rounded-full blur-[100px] opacity-30"></div>

            <div className="relative flex justify-center items-center">
              
              {/* FLOATING CARD: Notification (Positioned Lower) */}
              <div className="absolute -left-20 md:-left-36 top-80 z-30 animate-bounce" style={{ animationDuration: '6s' }}>
                <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-xl shadow-2xl border border-slate-100 w-64 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-green-600/20">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-center w-full mb-0.5">
                          <span className="text-[10px] font-bold text-slate-900">M-PESA</span>
                          <span className="text-[9px] text-slate-400">Now</span>
                        </div>
                        <div className="text-[10px] text-slate-600 leading-snug font-medium">
                          Dear <span className="text-slate-900 font-bold">Risper Omondi</span>, Your M-PESA Fuliza Limit has been increased to <span className="font-bold text-slate-900">KSH 7,600.00</span>.
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* THE PHONE - COMPACT HIGH DENSITY UI */}
              <div className="relative w-[360px] h-[740px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl z-20">
                {/* Physical Buttons */}
                <div className="absolute top-24 -left-[10px] w-[2px] h-8 bg-slate-700 rounded-l"></div>
                <div className="absolute top-36 -left-[10px] w-[2px] h-14 bg-slate-700 rounded-l"></div>
                <div className="absolute top-28 -right-[10px] w-[2px] h-16 bg-slate-700 rounded-r"></div>

                {/* Screen Container */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col font-sans">
                  
                  {/* Status Bar */}
                  <div className="h-10 bg-white flex items-end justify-between px-6 pb-2 z-20 relative flex-shrink-0">
                    <span className="text-[10px] font-semibold text-slate-900">9:41</span>
                    <div className="flex items-center gap-1">
                       <Wifi className="w-3.5 h-3.5 text-slate-800" />
                       <Battery className="w-3.5 h-3.5 text-slate-800" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-5 py-2 flex items-center justify-between bg-white z-10 flex-shrink-0">
                    {/* User Avatar (Risper) */}
                    <div className="w-8 h-8 rounded-full bg-pink-100 overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center">
                       <span className="text-xs font-bold text-pink-600">RO</span>
                    </div>
                    
                    {/* Header Icons */}
                    <div className="flex items-center gap-4 text-slate-600">
                      <Bell className="w-5 h-5 stroke-[1.5]" />
                      <Clock className="w-5 h-5 stroke-[1.5]" />
                      <div className="border border-slate-600 rounded-[2px] p-0.5">
                         <div className="w-2.5 h-2.5 bg-slate-600/20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Screen Content */}
                  <div className="flex-1 bg-white px-5 pt-4 flex flex-col relative overflow-y-auto no-scrollbar">
                    
                    {/* BALANCE SECTION - CLEAN & NATIVE */}
                    <div className="text-center mb-8 bg-white relative z-10">
                      <div className="text-[9px] text-slate-400 tracking-widest uppercase mb-1">BALANCE</div>
                      
                      <div className="flex items-center justify-center gap-2 mb-1">
                         <h3 className="text-2xl font-light text-slate-800 tracking-tight">
                           KSH. <span className="font-normal">2,450.00</span>
                         </h3>
                         {/* SVG Eye Icon */}
                         <div className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                             <circle cx="12" cy="12" r="3"/>
                           </svg>
                         </div>
                      </div>

                      {/* THE FULIZA PART - CLEAN NATIVE LOOK */}
                      <div className="text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1">
                        AVAILABLE FULIZA: <span className="text-slate-700 font-bold">KSH. 7,600.00</span>
                      </div>
                    </div>

                    {/* CIRCLE ACTION BUTTONS (Compact) */}
                    <div className="grid grid-cols-4 gap-2 mb-8 px-1">
                      {/* Send */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                          <RefreshCw className="w-5 h-5 text-white rotate-90" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 text-center leading-tight">SEND AND<br/>REQUEST</span>
                      </div>

                      {/* Pay */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 text-center leading-tight">PAY</span>
                      </div>

                      {/* Withdraw */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                          <ArrowRight className="w-5 h-5 text-white rotate-90" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 text-center leading-tight">WITHDRAW</span>
                      </div>

                      {/* Airtime */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                          <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 text-center leading-tight">AIRTIME</span>
                      </div>
                    </div>

                    {/* STATEMENTS HEADER */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">M-PESA STATEMENTS</span>
                      <span className="text-[10px] font-bold text-green-600 uppercase cursor-pointer">SEE ALL</span>
                    </div>

                    {/* TRANSACTION 1: Normal Shopping */}
                    <div className="flex items-center justify-between mb-2 py-2 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-blue-50 overflow-hidden border border-slate-100">
                           <div className="w-full h-full flex items-center justify-center font-bold text-blue-400 text-[10px]">
                             NS
                           </div>
                         </div>
                         <div>
                           <div className="text-[11px] font-bold text-slate-700 uppercase">NAIVAS SUPERMARKET</div>
                           <div className="text-[9px] text-slate-400">Buy Goods</div>
                         </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-slate-800">- KSH. 3,450.00</div>
                        <div className="text-[9px] text-slate-400">17 Jan, 10:45 AM</div>
                      </div>
                    </div>
                    
                    {/* TRANSACTION 2: Sending Money */}
                     <div className="flex items-center justify-between mb-8 py-2 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
                           <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                             <Users className="w-4 h-4 text-slate-400" />
                           </div>
                         </div>
                         <div>
                           <div className="text-[11px] font-bold text-slate-700 uppercase">JUMA KEVIN</div>
                           <div className="text-[9px] text-slate-400">0712 345 678</div>
                         </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-slate-800">- KSH. 500.00</div>
                        <div className="text-[9px] text-slate-400">16 Jan, 09:30 AM</div>
                      </div>
                    </div>

                    {/* SUGGESTED CARDS (Bottom) */}
                    <div className="mb-2 px-1">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">SUGGESTED FOR YOU</span>
                    </div>
                    
                    <div className="flex gap-3 overflow-hidden relative pb-4">
                       {/* Card 1: FULIZA */}
                       <div className="w-32 h-24 rounded-lg bg-slate-800 relative overflow-hidden flex-shrink-0 p-2.5 flex flex-col justify-end shadow-md">
                          <div className="absolute inset-0 bg-slate-700"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          
                          <div className="absolute top-2 left-2 w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shadow-lg">
                             <span className="font-bold text-white italic text-[10px]">f</span>
                          </div>
                          
                          <div className="relative z-10 text-white">
                             <div className="font-bold text-[10px]">FULIZA</div>
                             <div className="text-[8px] opacity-80 leading-tight">Buy now, pay later</div>
                          </div>
                       </div>
                       
                        {/* Card 2: Dark Mode */}
                       <div className="w-32 h-24 rounded-lg bg-yellow-600 relative overflow-hidden flex-shrink-0 p-2.5 flex flex-col justify-end shadow-md">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-900/50 flex items-center justify-center backdrop-blur-md">
                             <div className="w-3 h-3 rounded-full bg-white"></div>
                          </div>
                          <div className="relative z-10 text-white">
                             <div className="font-bold text-[10px]">DARK MODE</div>
                             <div className="text-[8px] opacity-80 leading-tight">Let's try it</div>
                          </div>
                       </div>
                    </div>

                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full opacity-20 z-30"></div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 6: 4 NEW MARKETING SCREENS (INSTANT LOANS) --- */}
        <div className="pb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Instant Loan User Journey</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
               High-fidelity marketing screens showing the flow from discovery to repayment.
            </p>
          </div>

          {/* GRID LAYOUT FOR 4 SCREENS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">

            {/* SCREEN 1: THE DASHBOARD (The Hook) */}
            <div className="relative group">
               {/* Marketing Label */}
               <div className="text-center mb-6">
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Screen 01</div>
                  <h3 className="text-xl font-bold text-slate-800">The Offer</h3>
                  <p className="text-xs text-slate-500">Instant limit visualization</p>
               </div>

               <PhoneFrame>
                  {/* Header */}
                  <div className="px-5 py-4 flex justify-between items-center bg-white border-b border-slate-50">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">JD</div>
                        <div>
                           <div className="text-[10px] text-slate-400">Good Morning</div>
                           <div className="text-sm font-bold text-slate-800">John Doe</div>
                        </div>
                     </div>
                     <Bell className="w-5 h-5 text-slate-400" />
                  </div>

                  {/* Main Content */}
                  <div className="p-5">
                     {/* Hero Card */}
                     <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        
                        <div className="text-blue-100 text-xs font-medium mb-1 flex items-center gap-2">
                           <Zap className="w-3 h-3 text-yellow-300 fill-current" />
                           Available Limit
                        </div>
                        <div className="text-3xl font-bold mb-4">KES 50,000</div>
                        
                        <button className="w-full bg-white text-blue-700 font-bold text-xs py-3 rounded-lg hover:bg-blue-50 transition-colors">
                           Unlock Cash Now
                        </button>
                     </div>

                     {/* Quick Actions */}
                     <div className="grid grid-cols-4 gap-2 mb-6">
                        {[
                           { icon: Wallet, label: "Borrow" },
                           { icon: CreditCard, label: "Repay" },
                           { icon: Smartphone, label: "Airtime" },
                           { icon: History, label: "History" }
                        ].map((item, i) => (
                           <div key={i} className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-600">
                                 <item.icon className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-medium text-slate-500">{item.label}</span>
                           </div>
                        ))}
                     </div>

                     {/* Recent Activity */}
                     <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-xs font-bold text-slate-700">Recent Activity</span>
                           <span className="text-[10px] text-blue-600 font-bold cursor-pointer">View All</span>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600" />
                                 </div>
                                 <div>
                                    <div className="text-xs font-bold text-slate-700">Loan Repaid</div>
                                    <div className="text-[10px] text-slate-400">Yesterday</div>
                                 </div>
                              </div>
                              <span className="text-xs font-bold text-slate-800">KES 4,500</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </PhoneFrame>
               
               {/* Floating Badge */}
               <div className="absolute -right-4 top-40 bg-white p-2 rounded-lg shadow-lg border border-slate-100 rotate-12 z-30">
                  <div className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                     <Shield className="w-3 h-3" /> Safe
                  </div>
               </div>
            </div>

            {/* SCREEN 2: THE SLIDER (Transparency) */}
            <div className="relative group">
               <div className="text-center mb-6">
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Screen 02</div>
                  <h3 className="text-xl font-bold text-slate-800">Customization</h3>
                  <p className="text-xs text-slate-500">Interactive loan slider</p>
               </div>

               <PhoneFrame>
                  {/* Header */}
                  <div className="px-5 py-4 flex items-center gap-4 bg-white border-b border-slate-50">
                     <ChevronLeft className="w-5 h-5 text-slate-800" />
                     <span className="text-sm font-bold text-slate-800">Request Loan</span>
                  </div>

                  <div className="p-5 flex flex-col h-full pb-12">
                     <div className="text-center mt-4 mb-8">
                        <span className="text-xs text-slate-500 font-medium">I want to borrow</span>
                        <div className="text-4xl font-bold text-slate-800 mt-2">
                           KES 15,000
                        </div>
                     </div>

                     {/* Slider Visual */}
                     <div className="mb-10 px-2">
                        <div className="h-2 bg-slate-200 rounded-full relative">
                           <div className="absolute left-0 top-0 bottom-0 w-[60%] bg-blue-600 rounded-full"></div>
                           <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-blue-600 rounded-full shadow-lg"></div>
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-bold uppercase">
                           <span>KES 500</span>
                           <span>KES 50,000</span>
                        </div>
                     </div>

                     {/* Terms */}
                     <div className="mb-6">
                        <span className="text-xs text-slate-500 font-medium block mb-3">Duration</span>
                        <div className="grid grid-cols-2 gap-3">
                           <button className="py-2.5 rounded-xl border border-blue-600 bg-blue-50 text-blue-700 text-xs font-bold">30 Days</button>
                           <button className="py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-bold">60 Days</button>
                        </div>
                     </div>

                     {/* Summary Card */}
                     <div className="bg-slate-100 rounded-xl p-4 mb-auto">
                        <div className="flex justify-between mb-3 text-xs">
                           <span className="text-slate-500">Service Fee</span>
                           <span className="font-bold text-slate-800">KES 450</span>
                        </div>
                        <div className="flex justify-between mb-3 text-xs">
                           <span className="text-slate-500">Tax</span>
                           <span className="font-bold text-slate-800">KES 50</span>
                        </div>
                        <div className="h-[1px] bg-slate-200 my-3"></div>
                        <div className="flex justify-between text-sm">
                           <span className="font-bold text-slate-800">Total Repayment</span>
                           <span className="font-bold text-blue-600">KES 15,500</span>
                        </div>
                     </div>

                     {/* Action */}
                     <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-4">
                        Get Cash Now <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </PhoneFrame>
            </div>

            {/* SCREEN 3: PROCESSING/SUCCESS (Speed) */}
            <div className="relative group">
               <div className="text-center mb-6">
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Screen 03</div>
                  <h3 className="text-xl font-bold text-slate-800">Instant Success</h3>
                  <p className="text-xs text-slate-500">The payout moment</p>
               </div>

               <PhoneFrame>
                  {/* Background blurring */}
                  <div className="absolute inset-0 bg-slate-100"></div>
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-10"></div>
                  
                  {/* Modal */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
                     <div className="bg-white w-full rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Confetti Decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400"></div>

                        <div className="text-center mb-6 pt-4">
                           <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                              <Check className="w-8 h-8 text-emerald-600 stroke-[3]" />
                           </div>
                           <h3 className="text-xl font-bold text-slate-900 mb-1">Money Sent!</h3>
                           <p className="text-xs text-slate-500 px-4">
                              We have transferred <span className="text-slate-900 font-bold">KES 15,000</span> to your M-PESA account.
                           </p>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4 mb-8 pl-4 border-l-2 border-emerald-100 ml-4">
                           <div className="relative">
                              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                              <div className="text-[10px] text-slate-400">10:02 AM</div>
                              <div className="text-xs font-medium text-slate-700">Application Approved</div>
                           </div>
                           <div className="relative">
                              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-500/50"></div>
                              <div className="text-[10px] text-emerald-600 font-bold">Just Now</div>
                              <div className="text-xs font-bold text-slate-900">Funds Disbursed</div>
                           </div>
                        </div>

                        <button className="w-full border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                           Done
                        </button>
                     </div>
                  </div>
               </PhoneFrame>

               {/* Floating Notification - Marketing Asset */}
               <div className="absolute -left-6 top-16 bg-slate-800 text-white p-3 rounded-xl shadow-xl z-30 max-w-[200px] animate-pulse">
                  <div className="flex gap-2">
                     <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-xs">M</span>
                     </div>
                     <div className="text-[10px]">
                        <span className="font-bold">M-PESA Confirmed</span><br/>
                        You have received KES 15,000...
                     </div>
                  </div>
               </div>
            </div>

            {/* SCREEN 4: REPAYMENT & GAMIFICATION (Relationship) */}
            <div className="relative group">
               <div className="text-center mb-6">
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Screen 04</div>
                  <h3 className="text-xl font-bold text-slate-800">Growth</h3>
                  <p className="text-xs text-slate-500">Repayment & Limit Increase</p>
               </div>

               <PhoneFrame>
                  <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-50">
                     <span className="text-sm font-bold text-slate-800">My Loan</span>
                     <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">Active</span>
                  </div>

                  <div className="p-5 flex flex-col h-full bg-white">
                     {/* Circular Progress */}
                     <div className="flex justify-center my-8 relative">
                        {/* SVG Ring */}
                        <svg className="w-48 h-48 transform -rotate-90">
                           <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                           <circle cx="96" cy="96" r="80" stroke="#2563eb" strokeWidth="12" fill="none" strokeDasharray="502" strokeDashoffset="200" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-xs text-slate-400 font-medium">Remaining</span>
                           <span className="text-3xl font-bold text-slate-800">KES 9K</span>
                           <span className="text-[10px] text-slate-400 mt-1">Due in 15 days</span>
                        </div>
                     </div>

                     {/* Payment Options */}
                     <div className="space-y-3 mb-8">
                        <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg flex justify-between px-6 items-center">
                           <span>Pay Full Amount</span>
                           <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl">
                           Make Partial Payment
                        </button>
                     </div>

                     {/* Gamification/Upsell */}
                     <div className="mt-auto bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-200 rounded-full -mr-10 -mt-10 opacity-50 blur-xl"></div>
                        
                        <div className="flex gap-3 relative z-10">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <Zap className="w-5 h-5 text-emerald-500 fill-current" />
                           </div>
                           <div>
                              <div className="text-xs font-bold text-slate-800">Unlock Higher Limits</div>
                              <div className="text-[10px] text-slate-600 leading-tight mt-1">
                                 Repay on time to unlock <span className="font-bold text-emerald-700">KES 60,000</span> next time!
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </PhoneFrame>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}