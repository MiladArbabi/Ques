export function generateAutoReplyContent(ticketId: string, customerName: string) {
  const link = `https://chat.ques.com/session/${ticketId}`;
  return {
    subject: `Hi ${customerName}, we got your request!`,
    body: `
      <p>Hey ${customerName},</p>
      <p>Thanks for reaching out. You can chat with our AI assistant instantly by clicking below:</p>
      <p><a href="${link}">Connect to AI Assistant</a></p>
      <p>We’re here to help!</p>
      <p>– The Ques Team</p>
    `,
  };
}
