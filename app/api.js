// সব API এক জায়গায় (ডেমো, বাস্তবে আলাদা ফোল্ডার/ফাইল structure হবে)
// উচ্চ নিরাপত্তা: JWT, CSRF, রেট-লিমিট, ইনপুট ভ্যালিডেশন, ইত্যাদি লাগবে

export async function loginApi({ email, password }) {
  // এখানে আসল API কল হবে
  return { success: true, user: { name: "ডেমো ইউজার", balance: 500 } };
}

export async function registerApi({ name, mobile, email, password }) {
  // এখানে আসল API কল হবে
  return { success: true };
}

export async function submitTaskApi({ title, desc, proof }) {
  // এখানে আসল API কল হবে
  return { success: true };
}

export async function paymentApi({ method, amount }) {
  // এখানে আসল API কল হবে
  return { success: true };
}

export async function getBalanceApi(userId) {
  // এখানে আসল API কল হবে
  return { balance: 500 };
}
