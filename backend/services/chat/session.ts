// backend/services/chat/session.ts
export function generateChatLink(ticketId: string) {
  return `https://chat.ques.com/session/${ticketId}`;
}