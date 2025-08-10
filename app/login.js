"use client";
import React, { useState } from "react";
import { loginApi } from "./api";
import Image from "next/image";
import Link from "next/link";
// লগইন ফর্ম (বাংলা ভাষা ও গুগল লগইন সহ)
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // গুগল লগইন হ্যান্ডলার (ডেমো, বাস্তব ইমপ্লিমেন্টেশনে OAuth API লাগবে)
  const handleGoogleLogin = () => {
    alert("গুগল লগইন ফিচার শীঘ্রই আসছে!");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }
    setError("");
    try {
      const res = await loginApi({ email, password });
      if (res.success) {
        // লোকালস্টোরেজে ইউজার সেভ করুন (ডেমো)
        localStorage.setItem('user', JSON.stringify(res.user));
        alert("লগইন সফল!");
        window.location.href = "/";
      } else {
        setError("ভুল তথ্য, আবার চেষ্টা করুন");
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
          <h2 className="text-2xl font-bold text-green-700 mt-2 mb-1">লগইন করুন</h2>
          <span className="text-gray-500 text-sm">আপনার অ্যাকাউন্টে প্রবেশ করুন</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="ইমেইল লিখুন" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="পাসওয়ার্ড লিখুন" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-full font-bold hover:bg-green-600 transition">লগইন</button>
        </form>
        <div className="my-4 flex items-center justify-center">
          <span className="h-px bg-gray-200 flex-1" />
          <span className="mx-2 text-gray-400 text-xs">অথবা</span>
          <span className="h-px bg-gray-200 flex-1" />
        </div>
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-green-500 text-green-700 font-bold py-3 rounded-full hover:bg-green-50 transition">
          <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.9 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.5 20-21 0-1.3-.1-2.1-.3-3z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 17.1 19.4 14 24 14c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.9 3 24 3 16.1 3 9.1 7.6 6.3 14.7z"/><path fill="#FBBC05" d="M24 44c6.1 0 11.2-2 14.9-5.4l-6.9-5.7C30.7 34.7 27.5 36 24 36c-6.1 0-11.2-3.9-13.1-9.3l-7 5.4C9.1 40.4 16.1 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.7 7.5-11.7 7.5-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.2 2.7l6.2-6.2C36.7 5.1 30.7 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.5 20-21 0-1.3-.1-2.1-.3-3z"/></g></svg>
          <span>গুগল দিয়ে লগইন করুন</span>
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          <span>নতুন ব্যবহারকারী? </span>
          <Link href="/register" className="text-green-600 font-bold hover:underline">রেজিস্ট্রেশন করুন</Link>
        </div>
      </div>
    </div>
  );
}
