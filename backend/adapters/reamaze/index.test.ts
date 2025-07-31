// backend/adapters/reamaze/index.test.ts
process.env.REAMAZE_API_URL    = 'https://reamaze.example.com';
process.env.REAMAZE_EMAIL      = 'user@example.com';
process.env.REAMAZE_API_TOKEN = 'test-token';
import axios from 'axios'
import { ReamazeAPI } from '../reamaze'

jest.mock('axios')
const mocked = axios as jest.Mocked<typeof axios>

describe('Re:amaze Adapter', () => {
  let api: ReamazeAPI
  const baseUrl   = 'https://reamaze.example.com'
  const email     = 'user@example.com'
  const apiToken = 'test-token'

  beforeAll(() => {
    process.env.REAMAZE_API_URL    = baseUrl
    process.env.REAMAZE_EMAIL      = email
    process.env.REAMAZE_API_TOKEN = apiToken
    api = new ReamazeAPI()
  })

  afterAll(() => {
    delete process.env.REAMAZE_API_URL
    delete process.env.REAMAZE_EMAIL
    delete process.env.REAMAZE_API_TOKEN
  })

  describe('listTickets()', () => {
    it('fetches message list & maps id and subject', async () => {
      const fakeConvos = [
        { id: 10, subject: 'Hello' },
        { id: 11, preview: 'Preview only' },
      ]
      mocked.get.mockResolvedValueOnce({
        data: { conversations: fakeConvos }
      })

      const tickets = await api.listTickets()

      expect(mocked.get).toHaveBeenCalledWith(
        `${baseUrl}/api/v1/conversations.json`,
        {
          auth: { username: email, password: apiToken },
          headers: { Accept: 'application/json' }
        }
      )
      expect(tickets).toEqual([
        { id: '10', subject: 'Hello', source: 'reamaze' },
        { id: '11', subject: 'Preview only', source: 'reamaze' },
      ])
    })

    it('propagates errors from axios', async () => {
      mocked.get.mockRejectedValueOnce(new Error('network failure'))

      await expect(api.listTickets()).rejects.toThrow('network failure')
    })
  })

  describe('getTicket()', () => {
    it('fetches a single ticket & maps correctly', async () => {
      const fakeConv = { id: 5, preview: 'Only preview', subject: 'Full subject' }
      mocked.get.mockResolvedValueOnce({
        data: { conversation: fakeConv }
      })

      const ticket = await api.getTicket('5')

      expect(mocked.get).toHaveBeenCalledWith(
        `${baseUrl}/api/v1/conversations/5.json`,
        {
          auth: { username: email, password: apiToken },
          headers: { Accept: 'application/json' }
        }
      )
      expect(ticket).toEqual({
        id: '5',
        subject: 'Full subject',
        source: 'reamaze',
      })
    })

    it('propagates errors from axios', async () => {
      mocked.get.mockRejectedValueOnce(new Error('boom'))

      await expect(api.getTicket('x')).rejects.toThrow('boom')
    })
  })
})

//   describe('createTicket()', () => {
//     it('posts a new ticket & returns created payload', async () => {
//       const input = { subject: 'New', body: 'Body' }
//       const created = { id: 9, subject: input.subject, body: input.body }
//       mocked.post.mockResolvedValueOnce({ data: { ticket: created } })

//       const ticket = await api.createTicket(input)

//       expect(mocked.post).toHaveBeenCalledWith(
//         `${baseUrl}/tickets.json`,
//         { ticket: input },
//         {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       expect(ticket).toEqual({
//         id: '9',
//         subject: 'New',
//         source: 'reamaze',
//       })
//     })

//     it('propagates errors from axios', async () => {
//       mocked.post.mockRejectedValueOnce(new Error('fail'))

//       await expect(api.createTicket({ subject: '', body: '' })).rejects.toThrow('fail')
//     })
//   })

//   describe('updateTicket()', () => {
//     it('puts updates & returns updated payload', async () => {
//       const input = { subject: 'Updated' }
//       const updated = { id: 7, subject: 'Updated' }
//       mocked.put.mockResolvedValueOnce({ data: { ticket: updated } })

//       const ticket = await api.updateTicket('7', input)

//       expect(mocked.put).toHaveBeenCalledWith(
//         `${baseUrl}/tickets/7.json`,
//         { ticket: input },
//         {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       expect(ticket).toEqual({
//         id: '7',
//         subject: 'Updated',
//         source: 'reamaze',
//       })
//     })

//     it('propagates errors from axios', async () => {
//       mocked.put.mockRejectedValueOnce(new Error('oops'))

//       await expect(api.updateTicket('n/a', {})).rejects.toThrow('oops')
//     })
//   })

//   describe('deleteTicket()', () => {
//     it('deletes a ticket & returns deletion response', async () => {
//       mocked.delete.mockResolvedValueOnce({ data: { deleted: true } })

//       const result = await api.deleteTicket('3')

//       expect(mocked.delete).toHaveBeenCalledWith(
//         `${baseUrl}/tickets/3.json`,
//         {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       expect(result).toEqual({ deleted: true })
//     })

//     it('propagates errors from axios', async () => {
//       mocked.delete.mockRejectedValueOnce(new Error('nope'))

//       await expect(api.deleteTicket('x')).rejects.toThrow('nope')
//     })
//   })
// })
