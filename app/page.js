"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PaymentForm from './components/PaymentForm';
import TaskSubmitForm from './components/TaskSubmitForm';
import AdsenseModal from './components/AdsenseModal';
import TakaManager from './takaManager';
import { canUseFree, recordUsage, getUsage } from './secureApi';
// Gemini API key is now used only in backend API route
// আইকনগুলো ব্যবহারের জন্য একটি সহজ কম্পোনেন্ট
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// ফিচার কার্ড কম্পোনেন্ট
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out text-center">
    <div className="flex justify-center items-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// 'কিভাবে কাজ করে' ধাপের জন্য কম্পোনেন্ট
const HowItWorksStep = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
    </div>
);

// প্রস্তাবিত কাজের কার্ড
const TaskCard = ({ title, description, reward }) => (
    <div className="bg-white p-5 rounded-lg shadow-lg border border-green-100 transform hover:-translate-y-2 transition-transform duration-300">
        <h4 className="text-lg font-bold text-green-700">{title}</h4>
        <p className="text-gray-600 my-2 text-sm">{description}</p>
        <div className="mt-3 text-right">
            <span className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">আয়: ৳{reward}</span>
        </div>
    </div>
);

// Gemini API দ্বারা চালিত টাস্ক সাজেশন সেকশন
const GeminiTaskSuggester = () => {
    const [taskPreference, setTaskPreference] = useState('');
    const [suggestedTasks, setSuggestedTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSuggestedTasks = async () => {
        if (!taskPreference) {
            setError('অনুগ্রহ করে আপনার পছন্দের কাজের ধরন লিখুন।');
            return;
        }
        setLoading(true);
        setError(null);
        setSuggestedTasks([]);

        const prompt = `আমি একজন বাংলাদেশী ব্যবহারকারী। আমি "${taskPreference}" সম্পর্কিত কাজ করতে আগ্রহী। আমার জন্য ৩টি নতুন এবং আকর্ষণীয় কাজের প্রস্তাব দিন যা আমি "টাস্ক-বাংলা" ওয়েবসাইটে করতে পারি। প্রতিটি কাজের জন্য একটি শিরোনাম, একটি সংক্ষিপ্ত বিবরণ এবং একটি আনুমানিক আয়ের পরিমাণ (BDT) দিন। আপনার উত্তরটি JSON ফরম্যাটে দিন। যেমন: [{"title": "কাজের শিরোনাম", "description": "কাজের বিবরণ", "reward": "৫০"}]`;
    try {
      const response = await fetch('/api/gemini-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskPreference })
      });
      if (!response.ok) throw new Error(`API থেকে উত্তর পাওয়া যায়নি।`);
      const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const rawJsonString = result.candidates[0].content.parts[0].text;
                const parsedTasks = JSON.parse(rawJsonString);
                setSuggestedTasks(parsedTasks);
            } else {
                throw new Error('API থেকে কোনো কাজের প্রস্তাব পাওয়া যায়নি।');
            }
        } catch (err) {
            console.error("API Error:", err);
            setError('দুঃখিত, এই মুহূর্তে কাজের প্রস্তাব দেওয়া সম্ভব হচ্ছে না।');
            setSuggestedTasks([
                {title: "ফেসবুক পেজ লাইক", description: "নির্দিষ্ট ফেসবুক পেজে লাইক এবং ফলো করুন।", reward: "৫"},
                {title: "ইউটিউব ভিডিও দেখা", description: "৫ মিনিটের একটি ভিডিও দেখুন এবং কমেন্ট করুন।", reward: "৮"},
                {title: "অ্যাপ ডাউনলোড", description: "প্লে-স্টোর থেকে একটি অ্যাপ ডাউনলোড করে ইন্সটল করুন।", reward: "১৫"},
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="gemini-suggester" className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">✨ আপনার জন্য AI প্রস্তাবিত কাজ</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">আপনি কি ধরনের কাজ করতে ভালোবাসেন? আমাদের জানান, আর আমাদের AI আপনার জন্য সেরা কাজগুলো খুঁজে বের করবে।</p>
                <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 mb-8">
                    <input type="text" value={taskPreference} onChange={(e) => setTaskPreference(e.target.value)} placeholder="যেমন: ভিডিও দেখা, ডেটা এন্ট্রি, ডিজাইন" className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-green-500 focus:outline-none transition-colors text-gray-500"/>
                    <button onClick={fetchSuggestedTasks} disabled={loading} className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? 'খুঁজছে...' : 'অনুসন্ধান করুন'}
                    </button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {loading && <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>}
                {suggestedTasks.length > 0 && <div className="grid md:grid-cols-3 gap-6 text-left">{suggestedTasks.map((task, index) => <TaskCard key={index} {...task} />)}</div>}
            </div>
        </section>
    );
};

// Gemini API দ্বারা চালিত টাস্ক রাইটার সেকশন (দৈনিক ১০ বার ফ্রি, এরপর ০.০১ টাকা কাটা)
const GeminiTaskCreator = ({ user, onBalanceChange }) => {
  const [taskIdea, setTaskIdea] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [generatedTask, setGeneratedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');

  const handleGenerateTask = async () => {
    if (!taskIdea || !taskReward) {
      setError('অনুগ্রহ করে কাজের ধারণা এবং পুরস্কারের পরিমাণ লিখুন।');
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedTask(null);
    setInfo('');

    // নিরাপত্তা: দৈনিক ১০ বার ফ্রি, এরপর ০.০১ টাকা কাটা
    let willCharge = false;
    let usage = 0;
    if (user && user.id) {
      usage = getUsage(user.id);
      if (!canUseFree(user.id)) willCharge = true;
    }
    if (willCharge && user && user.balance < 0.01) {
      setError('আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই (০.০১ টাকা)');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/gemini-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIdea, taskReward })
      });
      if (!response.ok) throw new Error(`API থেকে উত্তর পাওয়া যায়নি।`);
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0) {
        const rawJsonString = result.candidates[0].content.parts[0].text;
        const parsedTask = JSON.parse(rawJsonString);
        setGeneratedTask(parsedTask);
        // রেট-লিমিট রেকর্ড
        if (user && user.id) {
          recordUsage(user.id);
          if (willCharge && onBalanceChange) onBalanceChange(user.balance - 0.01);
        }
        setInfo(willCharge ? `আজ ${usage+1} বার ব্যবহার করেছেন, ০.০১ টাকা কাটা হয়েছে।` : `আজ ${usage+1} বার ব্যবহার করেছেন, ফ্রি!`);
      } else {
        throw new Error('API থেকে কোনো কাজের বিবরণ তৈরি করা যায়নি।');
      }
    } catch (err) {
      console.error("API Error:", err);
      setError('দুঃখিত, এই মুহূর্তে কাজটি তৈরি করা সম্ভব হচ্ছে না।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gemini-creator" className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">✨ AI দিয়ে নিজের কাজ পোস্ট করুন</h2>
            <p className="text-gray-600 mb-6">আপনার কি কোনো কাজ করানোর প্রয়োজন? শুধু কাজের ধারণা দিন, আমাদের AI আপনার জন্য একটি সম্পূর্ণ কাজের বিবরণী তৈরি করে দেবে।</p>
            <div className="space-y-4">
              <input type="text" value={taskIdea} onChange={(e) => setTaskIdea(e.target.value)} placeholder="কাজের ধারণা লিখুন (যেমন: ইউটিউব চ্যানেল সাবস্ক্রাইব)" className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-green-500 focus:outline-none text-gray-500 "/>
              <input type="number" value={taskReward} onChange={(e) => setTaskReward(e.target.value)} placeholder="পুরস্কারের পরিমাণ (টাকায়)" className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-green-500 focus:outline-none text-gray-500 "/>
              <button onClick={handleGenerateTask} disabled={loading} className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 font-bold shadow-lg transform hover:-translate-y-1 duration-300 disabled:bg-gray-400">
                {loading ? 'তৈরি হচ্ছে...' : 'কাজের বিবরণ তৈরি করুন'}
              </button>
            </div>
             {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
             {info && <p className="text-green-600 mt-2 text-center">{info}</p>}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">AI দ্বারা তৈরি প্রিভিউ</h3>
            <div className="bg-white p-6 rounded-xl shadow-2xl min-h-[250px] flex flex-col justify-center">
              {loading && <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>}
              {generatedTask ? (
                <div>
                  <h4 className="text-xl font-bold text-green-800 mb-3">{generatedTask.title}</h4>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <h5 className="font-semibold mb-1">নির্দেশনা:</h5>
                      <ul className="list-decimal list-inside space-y-1 text-sm">
                        {generatedTask.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">প্রয়োজনীয় প্রমাণ:</h5>
                      <p className="text-sm">{generatedTask.proof}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <span className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full">পুরস্কার: ৳{taskReward}</span>
                  </div>
                </div>
              ) : (
                !loading && <p className="text-center text-gray-500">এখানে আপনার তৈরি করা কাজের প্রিভিউ দেখানো হবে।</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// মূল অ্যাপ কম্পোনেন্ট
export default function App() {
  // ...existing code...
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [adsApiKey] = useState('YOUR_ADSENSE_API_KEY'); // এখানে আপনার আসল API key বসান
  // লগইন না করলে user=null, করলে user={...}
  const [user, setUser] = useState(null); // শুরুতে null
  // ইউজার লোকালস্টোরেজ থেকে লোড
  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);
  // ইউজার স্টেট চেঞ্জ হলে লোকালস্টোরেজ আপডেট
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);
  const [showPayment, setShowPayment] = useState(false);
  // ...existing code...
  const icons = {
    easyTask: <Icon path="M12 7.5h1.5m-1.5 4.5h1.5m-7.5 4.5h7.5m-7.5 4.5h7.5m3-12h.008v.008H18V7.5m-3 0h.008v.008H15V7.5m-3 0h.008v.008H12V7.5m0 4.5h.008v.008H12v-.008m0 4.5h.008v.008H12v-.008m0 4.5h.008v.008H12v-.008M4.5 3.75h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25v-12A2.25 2.25 0 014.5 3.75z" className="w-12 h-12 text-green-500" />,
    securePayment: <Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-12 h-12 text-green-500" />,
    banglaSupport: <Icon path="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502" className="w-12 h-12 text-green-500" />,
    register: <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-8 h-8 text-green-600" />,
    selectTask: <Icon path="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" className="w-8 h-8 text-green-600" />,
    earnMoney: <Icon path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v.75A.75.75 0 014.5 8.25h-.75m0 0H3.75A.75.75 0 013 7.5v-.75m9 12.75a60.07 60.07 0 0015.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75m-1.5-1.5a.75.75 0 00-.75.75v.75m0 0v.75a.75.75 0 00.75.75h.75m0 0h.75a.75.75 0 00.75-.75v-.75m0 0v-.75a.75.75 0 00-.75-.75h-.75m-6-3.75a.75.75 0 00-.75.75v.75m0 0v.75a.75.75 0 00.75.75h.75m0 0h.75a.75.75 0 00.75-.75v-.75m0 0v-.75a.75.75 0 00-.75-.75h-.75M12 15a.75.75 0 00-.75.75v.75m0 0v.75a.75.75 0 00.75.75h.75m0 0h.75a.75.75 0 00.75-.75v-.75m0 0v-.75a.75.75 0 00-.75-.75h-.75" className="w-8 h-8 text-green-600" />,
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans" style={{fontFamily: "'Hind Siliguri', sans-serif"}}>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">টাস্ক-বাংলা</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-green-600">ফিচারসমূহ</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-600">কিভাবে কাজ করে</a>
            <Link href="/login" className="text-gray-600 hover:text-green-600">লগইন</Link>
            <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 font-semibold">রেজিস্ট্রেশন করুন</Link>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-white py-4">
            <a href="#features" className="block text-center py-2 px-4 text-gray-600 hover:bg-green-50">ফিচারসমূহ</a>
            <a href="#how-it-works" className="block text-center py-2 px-4 text-gray-600 hover:bg-green-50">কিভাবে কাজ করে</a>
            <Link href="/login" className="block text-center py-2 px-4 text-gray-600 hover:bg-green-50">লগইন</Link>
            <Link href="/register" className="block text-center py-2 px-4 bg-green-500 text-white rounded-md mx-4 mt-2 font-semibold">রেজিস্ট্রেশন করুন</Link>
          </nav>
        )}
      </header>

      <main>
        {/* লগইন করার পর অ্যাডসেন্স বিজ্ঞাপন (একবার) */}
        {showAds && <AdsenseModal apiKey={adsApiKey} onClose={()=>setShowAds(false)} />}

        {/* হোম হেডার (শুধু টাইটেল ও সাবটাইটেল) */}
        <section className="bg-green-50 py-12 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">ঘরে বসে সহজ কাজ করে আয় করুন</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">টাস্ক-বাংলা প্ল্যাটফর্মে জয়েন করে প্রতিদিন ছোট ছোট কাজ সম্পন্ন করে আয় করার সুযোগ নিন।</p>
          </div>
        </section>

        {/* লগইন করার পর টাকার স্কোর ও উইথড্র বাটন উপরে ডান পাশে দেখাবে */}
        {user && (
          <div className="fixed top-4 right-4 z-40 flex gap-2 items-center">
            <TakaManager user={user} onBalanceChange={b=>setUser(u=>({...u, balance: b}))} />
            <button className="bg-green-500 text-white px-4 py-2 rounded-full font-bold hover:bg-green-600" onClick={()=>setShowPayment(true)}>
              টাকা উত্তোলন
            </button>
            <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-full font-bold hover:bg-gray-300" onClick={()=>{setUser(null); window.location.reload();}}>
              লগআউট
            </button>
          </div>
        )}

        {/* পেমেন্ট/উত্তোলন সিস্টেম: শুধু লগইন করার পর showPayment=true হলে দেখাবে */}
        {user && showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={()=>setShowPayment(false)}>&#10006;</button>
              <h3 className="text-2xl font-bold text-green-700 mb-4">টাকা উত্তোলন/ডিপোজিট</h3>
              <PaymentForm user={user} onBalanceChange={b=>setUser(u=>({...u, balance: b}))} minAmount={100} onPayment={data=>{console.log('পেমেন্ট:', data); setShowPayment(false);}} />
            </div>
          </div>
        )}

        {/* ফিচারসমূহ */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">আমাদের সেরা ফিচারসমূহ</h2>
              <p className="text-gray-500 mt-2">আপনার কাজ এবং আয়কে সহজ করার জন্য আমরা সেরা ফিচারগুলো নিয়ে এসেছি।</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard icon={icons.easyTask} title="সহজ কাজ" description="এখানে বিভিন্ন ধরনের সহজ কাজ পাওয়া যায়, যেমন - ভিডিও দেখা, সার্ভে পূরণ করা, ডেটা এন্ট্রি ইত্যাদি।" />
              <FeatureCard icon={icons.securePayment} title="নিরাপদ পেমেন্ট" description="আপনার অর্জিত টাকা বিকাশ, নগদ বা রকেটের মাধ্যমে ১০০% নিরাপদে উত্তোলন করতে পারবেন।" />
              <FeatureCard icon={icons.banglaSupport} title="সম্পূর্ণ বাংলা ইন্টারফেস" description="আমাদের ওয়েবসাইটটি সম্পূর্ণ বাংলায় তৈরি, তাই ভাষা নিয়ে কোনো সমস্যা হবে না।" />
            </div>
          </div>
        </section>

        {/* কাজ জমা ফর্ম: শুধু লগইন করার পর দেখাবে */}
        {user && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-xl">
              <h3 className="text-2xl font-bold text-green-700 mb-4">নতুন কাজ জমা দিন</h3>
              <TaskSubmitForm user={user} onBalanceChange={b=>setUser(u=>({...u, balance: b}))} onSubmit={data=>console.log('কাজ জমা:', data)} />
            </div>
          </section>
        )}

  {/* হোমপেজে আর কোনো পেমেন্ট/উত্তোলন অপশন থাকবে না */}

        {/* কিভাবে কাজ করে */}
        <section id="how-it-works" className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">মাত্র ৩টি সহজ ধাপে আয় শুরু করুন</h2>
                    <p className="text-gray-500 mt-2">আমাদের প্ল্যাটফর্মে কাজ করা খুবই সহজ।</p>
                </div>
                <div className="relative"><div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-green-200" style={{transform: 'translateY(-50%)'}}></div>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                       <HowItWorksStep icon={icons.register} title="১. একাউন্ট রেজিস্ট্রেশন" description="আপনার নাম, মোবাইল ও ইমেইল দিয়ে সহজেই রেজিস্ট্রেশন সম্পন্ন করুন।" />
                       <HowItWorksStep icon={icons.selectTask} title="২. পছন্দের কাজ বাছাই" description="কাজের তালিকা থেকে আপনার পছন্দের ও সহজ কাজগুলো বেছে নিন।" />
                       <HowItWorksStep icon={icons.earnMoney} title="৩. কাজ জমা দিন ও আয় করুন" description="নির্দেশনা অনুযায়ী কাজ শেষ করে প্রমাণসহ জমা দিন এবং টাকা আয় করুন।" />
                    </div>
                </div>
            </div>
        </section>

        {/* AI টাস্ক সাজেশন ও টাস্ক ক্রিয়েটর */}
        <GeminiTaskSuggester />
  <GeminiTaskCreator user={user} onBalanceChange={b=>setUser(u=>({...u, balance: b}))} />
      </main>

      {/* ফুটার: কোম্পানির লোগো ও প্রচার বার্তা সহ */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-gray-300 text-sm font-semibold">একটি MoJoX কোম্পানির উদ্যোগ</span>
              <span className="inline-block align-middle">
                <Image
                  src="/logo.svg"
                  alt="MoJoX Logo"
                  width={45}
                  height={45}
                  className="inline-block object-contain align-middle"
                  unoptimized
                />
              </span>
            </div>
            <span className="text-green-400 text-xs mt-1">বাংলার জন্য প্রযুক্তি, আয়ের জন্য টাস্ক-বাংলা!</span>
          </div>
          <p className="text-sm text-gray-400">&copy; ২০২৫ টাস্ক-বাংলা, MoJoX দ্বারা পরিচালিত। সকল স্বত্ব সংরক্ষিত।</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-green-400 text-sm">গোপনীয়তা নীতি</a>
            <a href="#" className="hover:text-green-400 text-sm">শর্তাবলী</a>
            <a href="#" className="hover:text-green-400 text-sm">যোগাযোগ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
