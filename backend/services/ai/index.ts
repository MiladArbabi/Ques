// backend/services/ai/index.ts
export async function classifyMessage(text: string): Promise<{ category: string }> {
  // super-naïve keyword matching
  if (/refund|return/i.test(text))         return { category: 'support' };
  if (/buy|order|price|cost/i.test(text))  return { category: 'sales'   };
  return { category: 'general' };
}
