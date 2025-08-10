// pages/api/gemini-suggest.js
// Next.js API route for Gemini API proxy (keeps API key secret)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { taskPreference } = req.body;
  if (!taskPreference) {
    return res.status(400).json({ error: 'Missing task preference' });
  }
  const prompt = `আমি একজন বাংলাদেশী ব্যবহারকারী। আমি "${taskPreference}" সম্পর্কিত কাজ করতে আগ্রহী। আমার জন্য ৩টি নতুন এবং আকর্ষণীয় কাজের প্রস্তাব দিন যা আমি "টাস্ক-বাংলা" ওয়েবসাইটে করতে পারি। প্রতিটি কাজের জন্য একটি শিরোনাম, একটি সংক্ষিপ্ত বিবরণ এবং একটি আনুমানিক আয়ের পরিমাণ (BDT) দিন। আপনার উত্তরটি JSON ফরম্যাটে দিন। যেমন: [{"title": "কাজের শিরোনাম", "description": "কাজের বিবরণ", "reward": "৫০"}]`;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
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
