"use client";
import React, { useState } from "react";
import { paymentApi } from "../api";
// পেমেন্ট ফর্ম (বিকাশ, নগদ, রকেট, PayPal/Stripe)
export default function PaymentForm({ minAmount = 100, onPayment, user, onBalanceChange }) {
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // নিরাপত্তা: ক্লায়েন্টে মিনিমাম চেক, সার্ভারে আবার চেক করতে হবে
  const handleSubmit = async e => {
    e.preventDefault();
    if (!method || !amount) {
      setError("সব তথ্য দিন");
      return;
    }
    if (parseInt(amount) < minAmount) {
      setError(`ন্যূনতম উত্তোলন ${minAmount} টাকা`);
      return;
    }
    if (user && parseInt(amount) > user.balance) {
      setError("আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই");
      return;
    }
    setError("");
    setSuccess("");
    try {
      // API কল
      const res = await paymentApi({ method, amount });
      if (res.success) {
        if (onBalanceChange && user) onBalanceChange(user.balance - parseInt(amount));
        setSuccess("পেমেন্ট অনুরোধ সফল! টাকা কেটে নেওয়া হয়েছে।");
        setAmount(""); setMethod("");
        onPayment && onPayment({ method, amount });
      } else {
        setError("পেমেন্ট ব্যর্থ, আবার চেষ্টা করুন");
      }
    } catch {
      setError("সার্ভার সমস্যা, পরে চেষ্টা করুন");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" value={method} onChange={e=>setMethod(e.target.value)}>
        <option value="">পেমেন্ট মাধ্যম নির্বাচন করুন</option>
        <option value="bkash">বিকাশ</option>
        <option value="nagad">নগদ</option>
        <option value="rocket">রকেট</option>
        <option value="paypal">PayPal</option>
        <option value="stripe">Stripe</option>
      </select>
      <input type="number" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="টাকার পরিমাণ" value={amount} onChange={e=>setAmount(e.target.value)} />
  {error && <p className="text-red-500 text-sm">{error}</p>}
  {success && <p className="text-green-600 text-sm">{success}</p>}
  <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-full font-bold hover:bg-green-600 transition">উত্তোলন করুন</button>
    </form>
  );
}
