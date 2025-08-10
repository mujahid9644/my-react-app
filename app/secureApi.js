// উচ্চ নিরাপত্তা (security) middleware/helper ফাইল
// এখানে সব API ফাংশন যুক্ত করা যাবে এবং নিরাপত্তা চেক (rate-limit, token, etc) সহজে করা যাবে

// উদাহরণ: রেট-লিমিট (একই user/ip দিনে ১০ বার ফ্রি, এরপর প্রতি রিকুয়েস্টে ০.০১ টাকা কাটা)
const userUsage = {};
const FREE_LIMIT = 10;
const EXTRA_COST = 0.01;

export function canUseFree(userId) {
  const today = new Date().toISOString().slice(0,10);
  if (!userUsage[userId]) userUsage[userId] = {};
  if (userUsage[userId][today] == null) userUsage[userId][today] = 0;
  return userUsage[userId][today] < FREE_LIMIT;
}

export function recordUsage(userId) {
  const today = new Date().toISOString().slice(0,10);
  if (!userUsage[userId]) userUsage[userId] = {};
  if (userUsage[userId][today] == null) userUsage[userId][today] = 0;
  userUsage[userId][today]++;
}

export function getUsage(userId) {
  const today = new Date().toISOString().slice(0,10);
  return userUsage[userId]?.[today] || 0;
}

// এখানে নতুন API ফাংশন যুক্ত করুন (কমেন্ট দিয়ে আলাদা করে রাখুন)

// উদাহরণ: ইউজার অথেন্টিকেশন (JWT/Token চেক)
// export function checkAuth(token) { ... }

// উদাহরণ: কাজ জমা/উত্তোলন/পেমেন্ট API
// export async function submitTaskSecure(args) { ... }
// export async function withdrawSecure(args) { ... }

// উদাহরণ: অ্যাডমিন API (শুধু নির্দিষ্ট রোল/টোকেন চেক)
// export async function adminOnlyApi(args) { ... }

// এখানে আরও ফাংশন যোগ করুন...
