"use client";
import React, { useState } from "react";
// টাকা ম্যানেজমেন্ট ও হাই-সিকিউরিটি সিস্টেম (ডেমো)
export default function TakaManager({ user, onBalanceChange }) {
  const [balance, setBalance] = useState(user?.balance || 0);
  // হাই-সিকিউরিটি: সব API কল JWT/CSRF/রেট-লিমিট/ডাবল-চেক সহ হবে
  // এখানে শুধু ডেমো লজিক
  const handleAdd = amt => {
    if (amt < 0) return;
    setBalance(b => {
      const newBal = b + amt;
      onBalanceChange && onBalanceChange(newBal);
      return newBal;
    });
  };
  const handleDeduct = amt => {
    if (amt < 0 || amt > balance) return;
    setBalance(b => {
      const newBal = b - amt;
      onBalanceChange && onBalanceChange(newBal);
      return newBal;
    });
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-md text-center">
      <h3 className="text-lg font-bold text-green-700 mb-2">আপনার ব্যালেন্স</h3>
      <div className="text-2xl font-extrabold text-gray-800 mb-2">৳ {balance}</div>
      <div className="flex justify-center gap-2">
        <button className="bg-green-500 text-white px-4 py-2 rounded-full font-bold hover:bg-green-600" onClick={()=>handleAdd(10)}>+১০</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600" onClick={()=>handleDeduct(10)}>-১০</button>
      </div>
      <div className="text-xs text-gray-400 mt-2">(ডেমো: আসল লেনদেন API দিয়ে হবে)</div>
    </div>
  );
}
