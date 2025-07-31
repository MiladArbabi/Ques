import { sendAutoReply } from './index';
import * as sendGrid from '../../adapters/sendGrid';
import * as twilio   from '../../adapters/twilio';

jest.mock('../../adapters/sendGrid');
jest.mock('../../adapters/twilio');

const mockedSendEmail = sendGrid.sendEmail as jest.MockedFunction<typeof sendGrid.sendEmail>;
const mockedSendSms   = twilio.sendSms   as jest.MockedFunction<typeof twilio.sendSms>;

describe('sendAutoReply', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders templates and calls both adapters with customerName', async () => {
    const ctx = {
      toEmail: 'foo@bar.com',
      toPhone: '+15550001111',
      ticketId: 'TICKET-42',
      customerName: 'Alice',
    };

    mockedSendEmail.mockResolvedValue(undefined);
    mockedSendSms.mockResolvedValue(undefined);

    await sendAutoReply(ctx);

    // email
    expect(mockedSendEmail).toHaveBeenCalledTimes(1);
    expect(mockedSendEmail).toHaveBeenCalledWith({
      to: 'foo@bar.com',
      subject: 'We received your request',
      html: expect.stringContaining('Thanks for contacting us, Alice!'),
    });

    // sms
    expect(mockedSendSms).toHaveBeenCalledTimes(1);
    expect(mockedSendSms).toHaveBeenCalledWith({
      to: '+15550001111',
      body: expect.stringContaining("we've received your support request (#TICKET-42)"),
    });
  });

  it('falls back when customerName is missing', async () => {
    const ctx = {
      toEmail: 'no-name@bar.com',
      toPhone: '+15552223333',
      ticketId: 'T-007',
    };

    mockedSendEmail.mockResolvedValue(undefined);
    mockedSendSms.mockResolvedValue(undefined);

    await sendAutoReply(ctx as any);

    expect(mockedSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Thanks for contacting us, Customer!')
      })
    );
    expect(mockedSendSms).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('Hi ,')
      })
    );
  });

  it('propagates errors from either adapter', async () => {
    mockedSendEmail.mockRejectedValue(new Error('email down'));
    mockedSendSms.mockResolvedValue(undefined);

    await expect(sendAutoReply({
      toEmail: 'err@bar.com',
      toPhone: '+15553334444',
      ticketId: 'ERR-1',
      customerName: 'Bob',
    })).rejects.toThrow('email down');
  });
});
