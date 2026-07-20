import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  Sparkles,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  HelpCircle,
  Coins,
  History,
  TrendingUp,
  Loader
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  createdAt: string;
}

export const Billing: React.FC = () => {
  const { user, updateUserCredits, updateUserPlan } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/billing/transactions');
      setTransactions(response.data);
    } catch (e) {
      console.warn('Failed to retrieve transactions:', e);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Initiate purchase flow
  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/billing/order', { amount: 499 });
      setOrderInfo(response.data);
      
      if (response.data.isMock) {
        // Show simulated modal
        setShowCheckoutModal(true);
      } else {
        // Load Razorpay Live Script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => openRazorpayCheckout(response.data);
        document.body.appendChild(script);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment order creation failed.');
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (order: any) => {
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'SkillForge AI',
      description: 'Premium upgrade subscription plan',
      order_id: order.orderId,
      handler: async (response: any) => {
        try {
          const verifyRes = await axios.post('/api/billing/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          // Update user store
          updateUserCredits(verifyRes.data.credits);
          updateUserPlan('PREMIUM');
          triggerSuccessConfetti();
          setSuccess('Upgrade successful! Premium features enabled.');
          fetchTransactions();
        } catch (e: any) {
          setError(e.response?.data?.error || 'Verification signature failed.');
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#6366f1',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleSimulateMockPayment = async () => {
    if (!orderInfo) return;
    setLoading(true);
    setShowCheckoutModal(false);

    try {
      const verifyRes = await axios.post('/api/billing/verify', {
        razorpay_order_id: orderInfo.orderId,
        isMockBypass: true,
      });

      // Update user details
      updateUserCredits(verifyRes.data.credits);
      updateUserPlan('PREMIUM');
      triggerSuccessConfetti();
      setSuccess('Upgrade successful! Premium features enabled via developer simulation.');
      fetchTransactions();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Simulation validation error.');
    } finally {
      setLoading(false);
    }
  };

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899'],
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs max-w-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs max-w-md">
          <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
          <span>{success}</span>
        </div>
      )}

      {/* Pricing Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
        
        {/* FREE tier */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/20 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Baseline Tier</span>
            <h3 className="text-lg font-bold text-slate-200 mt-1">SkillForge Free</h3>
            <p className="text-xs text-slate-500 mt-2">Perfect for exploring standard AI services.</p>
            
            <div className="my-6">
              <span className="text-2xl font-black text-slate-100">₹0</span>
              <span className="text-xs text-slate-500">/ forever</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-400 border-t border-white/5 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>10 free initial platform credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>AI Chat Assistant access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>Upload PDF & document parsing</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full mt-8 bg-slate-800 text-slate-400 rounded-xl py-3 font-semibold text-xs transition-all opacity-50"
          >
            Current Active Tier
          </button>
        </div>

        {/* PREMIUM tier */}
        <div className="p-6 rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/10 via-purple-950/5 to-transparent flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-lg">
            Popular 🔥
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Pro Tier</span>
            <h3 className="text-lg font-bold text-slate-200 mt-1">SkillForge Premium</h3>
            <p className="text-xs text-slate-500 mt-2">Unlimited capabilities for professionals and job seekers.</p>
            
            <div className="my-6">
              <span className="text-2xl font-black text-slate-100">₹499</span>
              <span className="text-xs text-slate-500">/ one-time recharge</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300 border-t border-white/5 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span className="font-semibold text-slate-200">+1000 standard premium credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>ATS resume scorers & cover letter builders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>Career Roadmaps milestone creators</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>Audio Mock Interview practice evaluations</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-650 hover:to-purple-750 text-white rounded-xl py-3 font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Purchase Premium Plan</span>
          </button>
        </div>

      </div>

      {/* Invoice list */}
      <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40">
        <h3 className="text-sm font-heading font-bold text-slate-200 mb-4 flex items-center gap-1.5">
          <History className="w-4.5 h-4.5 text-indigo-400" />
          <span>Transactions History</span>
        </h3>
        
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500">
                <th className="py-2.5">Date</th>
                <th>Order ID</th>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-650">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/2 text-slate-350">
                    <td className="py-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="font-mono text-[10px] text-slate-500">{tx.razorpayOrderId}</td>
                    <td className="font-mono text-[10px] text-slate-500">{tx.razorpayPaymentId || 'N/A'}</td>
                    <td className="font-semibold text-slate-300">₹{tx.amount}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        tx.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : tx.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-450'
                          : 'bg-rose-500/10 text-rose-450'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mock Sandbox Checkout Dialog */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span>Sandbox Developer Checkout</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Razorpay API credentials are not set in the environment files. You can simulate a successful transaction below to grant premium access.
            </p>

            <div className="p-3.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 space-y-1.5 text-xs mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Description:</span>
                <span className="font-semibold text-slate-300">Premium Upgrade Bundle</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Value:</span>
                <span className="font-semibold text-slate-300">₹499.00</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-xs font-semibold text-slate-400"
              >
                Cancel Order
              </button>
              <button
                onClick={handleSimulateMockPayment}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-650 hover:to-purple-750 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25"
              >
                Simulate Payment ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Billing;
