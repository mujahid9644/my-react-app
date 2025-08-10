"use client";
import React, { useEffect, useState } from "react";
// লগইনের পর একবারই দেখানো হবে এমন গুগল অ্যাডসেন্স বিজ্ঞাপন (ডেমো)
export default function AdsenseModal({ apiKey, onClose }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (!show) onClose && onClose();
  }, [show]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={()=>setShow(false)}>&#10006;</button>
        <h2 className="text-xl font-bold text-green-700 mb-2">বিজ্ঞাপন</h2>
        {/* এখানে আসল গুগল অ্যাডসেন্স কোড বসবে */}
        <div className="my-4">
          <span className="text-gray-500 text-sm">Google Adsense (API Key: {apiKey || "demo"})</span>
          <div className="bg-gray-100 rounded-lg p-4 mt-2">এখানে আপনার বিজ্ঞাপন দেখানো হবে।</div>
        </div>
        <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600" onClick={()=>setShow(false)}>বন্ধ করুন</button>
      </div>
    </div>
  );
}
