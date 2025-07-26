import { generateAutoReplyContent } from './autoReply';

describe('AutoReply Template', () => {
  it('renders subject and body with correct link', () => {
    const { subject, body } = generateAutoReplyContent('TICKET123', 'Alice');
    expect(subject).toContain('Alice');
    expect(body).toContain('TICKET123');
    expect(body).toContain('<a href="https://chat.ques.com/session/TICKET123">');
  });
});
