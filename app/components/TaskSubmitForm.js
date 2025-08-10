"use client";
import React, { useState } from "react";
import { submitTaskApi, getBalanceApi } from "../api";
// কাজ জমা ফর্ম (বাংলা ভাষা, এডিট অপশন সহ)
export default function TaskSubmitForm({ onSubmit, user, onBalanceChange }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [proof, setProof] = useState("");
  const [taskCount, setTaskCount] = useState(1);
  const [perTask, setPerTask] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // কাজ কনফার্ম
  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !desc || !proof || !taskCount || !perTask) {
      setError("সব তথ্য দিন");
      return;
    }
    if (taskCount < 1 || perTask < 1) {
      setError("কাজের সংখ্যা ও প্রতি কাজের টাকা ১ বা তার বেশি হতে হবে");
      return;
    }
    const total = taskCount * perTask;
    if (user?.balance < total) {
      setError(`আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই (প্রয়োজন: ৳${total})`);
      return;
    }
    setError("");
    setSuccess("");
    try {
      // কাজ পোস্ট API
      const res = await submitTaskApi({ title, desc, proof, taskCount, perTask });
      if (res.success) {
        // ব্যালেন্স কেটে নেওয়া
        onBalanceChange && onBalanceChange(user.balance - total);
        setSuccess("কাজ সফলভাবে পোস্ট হয়েছে এবং টাকা কেটে নেওয়া হয়েছে!");
        setTitle(""); setDesc(""); setProof(""); setTaskCount(1); setPerTask(1);
        onSubmit && onSubmit({ title, desc, proof, taskCount, perTask });
      } else {
        setError("কাজ পোস্ট ব্যর্থ, আবার চেষ্টা করুন");
      }
    } catch {
      setError("সার্ভার সমস্যা, পরে চেষ্টা করুন");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="কাজের শিরোনাম" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="কাজের বিস্তারিত" value={desc} onChange={e=>setDesc(e.target.value)} />
      <input type="text" className="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="প্রমাণ (যেমন: স্ক্রিনশট লিঙ্ক)" value={proof} onChange={e=>setProof(e.target.value)} />
      <div className="flex gap-2">
        <input type="number" min="1" className="w-1/2 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="কতজন কাজ করবে" value={taskCount} onChange={e=>setTaskCount(Number(e.target.value))} />
        <input type="number" min="1" className="w-1/2 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 outline-none text-gray-700" placeholder="প্রতি কাজের টাকা" value={perTask} onChange={e=>setPerTask(Number(e.target.value))} />
      </div>
      <div className="text-green-700 font-bold">মোট টাকা কাটা হবে: ৳{taskCount * perTask}</div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-full font-bold hover:bg-green-600 transition">কাজ কনফার্ম করুন</button>
    </form>
  );
}
