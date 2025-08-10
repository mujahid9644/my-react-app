"use client";
import React, { useState } from "react";
import { registerApi } from "./api";
import Image from "next/image";
import Link from "next/link";
// রেজিস্ট্রেশন ফর্ম (বাংলা ভাষা ও গুগল সাইনআপ সহ)
export default function Register() {
  const [form, setForm] = useState({name: "", mobile: "", email: "", password: ""});
  const [error, setError] = useState("");
  // গুগল সাইনআপ হ্যান্ডলার (ডেমো, বাস্তব ইমপ্লিমেন্টেশনে OAuth API লাগবে)
  const handleGoogleSignup = () => {
    alert("গুগল সাইনআপ ফিচার শীঘ্রই আসছে!");
  };
  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.email || !form.password) {
      setError("সব তথ্য বাংলায় পূরণ করুন");
      return;
    }
    setError("");
    try {
      const res = await registerApi(form);
      if (res.success) {
        alert("রেজিস্ট্রেশন সফল! লগইন করুন।");
        window.location.href = "/login";
      } else {
        setError("রেজিস্ট্রেশন ব্যর্থ, আবার চেষ্টা করুন");
      }
    } catch {
      setError("সার্ভার সমস্যা, পরে চেষ্টা করুন");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 font-sans" style={{fontFamily: "'Hind Siliguri', sans-serif"}}>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} unoptimized />
          <h2 className="text-2xl font-bold text-green-700 mt-2 mb-1">নতুন একাউন্ট খুলুন</h2>
          <span className="text-gray-500 text-sm">নাম, মোবাইল, ইমেইল ও পাসওয়ার্ড দিন</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="আপনার নাম" value={form.name} onChange={handleChange} />
          <input name="mobile" type="text" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="মোবাইল নম্বর" value={form.mobile} onChange={handleChange} />
          <input name="email" type="email" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="ইমেইল" value={form.email} onChange={handleChange} />
          <input name="password" type="password" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="পাসওয়ার্ড" value={form.password} onChange={handleChange} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-full font-bold hover:bg-green-600 transition">রেজিস্ট্রেশন করুন</button>
        </form>
        <div className="my-4 flex items-center justify-center">
          <span className="h-px bg-gray-200 flex-1" />
          <span className="mx-2 text-gray-400 text-xs">অথবা</span>
          <span className="h-px bg-gray-200 flex-1" />
        </div>
        <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-green-500 text-green-700 font-bold py-3 rounded-full hover:bg-green-50 transition">
          <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.9 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.5 20-21 0-1.3-.1-2.1-.3-3z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 17.1 19.4 14 24 14c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.9 3 24 3 16.1 3 9.1 7.6 6.3 14.7z"/><path fill="#FBBC05" d="M24 44c6.1 0 11.2-2 14.9-5.4l-6.9-5.7C30.7 34.7 27.5 36 24 36c-6.1 0-11.2-3.9-13.1-9.3l-7 5.4C9.1 40.4 16.1 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.7 7.5-11.7 7.5-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.2 2.7l6.2-6.2C36.7 5.1 30.7 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.5 20-21 0-1.3-.1-2.1-.3-3z"/></g></svg>
          <span>গুগল দিয়ে সাইন আপ করুন</span>
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          <span>ইতিমধ্যে একাউন্ট আছে? </span>
          <Link href="/login" className="text-green-600 font-bold hover:underline">লগইন করুন</Link>
        </div>
      </div>
    </div>
  );
}
