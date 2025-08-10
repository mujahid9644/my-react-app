// pages/api/gemini-create.js
// Next.js API route for Gemini Task Creator (keeps API key secret)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { taskIdea, taskReward } = req.body;
  if (!taskIdea || !taskReward) {
    return res.status(400).json({ error: 'Missing data' });
  }
  const prompt = `একজন ক্লায়েন্ট "টাস্ক-বাংলা" ওয়েবসাইটে একটি কাজ পোস্ট করতে চায়। তার কাজের ধারণা হলো: "${taskIdea}"। এই কাজের জন্য পুরস্কার হলো ${taskReward} টাকা। এই তথ্যের উপর ভিত্তি করে, কাজটির জন্য একটি পূর্ণাঙ্গ বিবরণ তৈরি করুন। আপনার উত্তরে একটি JSON অবজেক্ট থাকবে যেখানে নিম্নলিখিত কী থাকবে: "title" (একটি আকর্ষণীয় শিরোনাম), "instructions" (ধাপে ধাপে করণীয় কাজের তালিকা, একটি অ্যারে হিসেবে), এবং "proof" (কি প্রমাণ জমা দিতে হবে তার বিবরণ)। সবকিছু অবশ্যই সহজবোধ্য বাংলা ভাষায় হবে।`;
  try {
    const apiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    if (!response.ok) throw new Error('Gemini API error');
    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
