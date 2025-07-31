import { classifyMessage } from './index'
describe('AI NLP Stub', () => {
  it('returns a category object', async () => {
    const result = await classifyMessage('hello');
    expect(result).toEqual({ category: 'general' });
  });

  it('recognizes “refund” as support', async () => {
     const r = await classifyMessage('please refund me');
     expect(r).toEqual({ category: 'support' });
   });
})
