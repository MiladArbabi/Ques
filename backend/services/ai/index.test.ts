import { analyzeText } from './index'
describe('AI NLP Stub', () => {
  it('returns default structure', async () => {
    const result = await analyzeText('hello')
    expect(result).toEqual({ intent: 'unknown', sentiment: 0 })
  })
})
