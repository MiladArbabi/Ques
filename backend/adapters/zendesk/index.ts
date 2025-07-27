// backend/adapters/zendesk/index.ts
import axios from 'axios';

function getConfig() {
  return {
    base:  process.env.ZENDESK_API_URL!,
    auth: {
      username:  `${process.env.ZENDESK_EMAIL}/token`,
      password:  process.env.ZENDESK_API_TOKEN!,
    }
  };
}

export async function getTicket(id: string) {
  const { base, auth } = getConfig();
  try {
    const response = await axios.get(`${base}/tickets/${id}.json`, { auth });
    return response.data.ticket;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
}

export async function createTicket(ticketData: any) {
  const { base, auth } = getConfig();
  try {
    const response = await axios.post(
      `${base}/tickets.json`,
      { ticket: ticketData },
      { auth }
    );
    return response.data.ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

export async function updateTicket(id: string, ticketData: any) {
  const { base, auth } = getConfig();
  try {
    const response = await axios.put(
      `${base}/tickets/${id}.json`,
      { ticket: ticketData },
      { auth }
    );
    return response.data.ticket;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
}

export async function deleteTicket(id: string) {
  const { base, auth } = getConfig();
  try {
    await axios.delete(`${base}/tickets/${id}.json`, { auth });
    return { success: true };
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
}

export async function listTickets() {
  const { base, auth } = getConfig();
  try {
    const response = await axios.get(`${base}/tickets.json`, { auth });
    return response.data.tickets;
  } catch (error) {
    console.error('Error listing tickets:', error);
    throw error;
  }
}

export async function searchTickets(query: string) {
  const { base, auth } = getConfig();
  try {
    const response = await axios.get(`${base}/search.json`, {
      params: { query },
      auth
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching tickets:', error);
    throw error;
  }
}

export async function getTicketComments(ticketId: string) {
  const { base, auth } = getConfig();
  try {
    const response = await axios.get(
      `${base}/tickets/${ticketId}/comments.json`,
      { auth }
    );
    return response.data.comments;
  } catch (error) {
    console.error('Error fetching ticket comments:', error);
    throw error;
  }
}

export async function addTicketComment(ticketId: string, commentData: any) {
  const { base, auth } = getConfig();
  try {
    const response = await axios.post(
      `${base}/tickets/${ticketId}/comments.json`,
      { comment: commentData },
      { auth }
    );
    return response.data.comment;
  } catch (error) {
    console.error('Error adding ticket comment:', error);
    throw error;
  }
}

export async function updateTicketComment(
  ticketId: string,
  commentId: string,
  commentData: any
) {
  const { base, auth } = getConfig();
  try {
    const response = await axios.put(
      `${base}/tickets/${ticketId}/comments/${commentId}.json`,
      { comment: commentData },
      { auth }
    );
    return response.data.comment;
  } catch (error) {
    console.error('Error updating ticket comment:', error);
    throw error;
  }
}

export async function deleteTicketComment(
  ticketId: string,
  commentId: string
) {
  const { base, auth } = getConfig();
  try {
    await axios.delete(
      `${base}/tickets/${ticketId}/comments/${commentId}.json`,
      { auth }
    );
    return { success: true };
  } catch (error) {
    console.error('Error deleting ticket comment:', error);
    throw error;
  }
}
