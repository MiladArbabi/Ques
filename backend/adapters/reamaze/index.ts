import axios from 'axios';

function getConfig() {
  return {
    base: process.env.REAMAZE_API_URL!,
    headers: {
      'Authorization': `Bearer ${process.env.REAMAZE_API_KEY!}`,
      'Content-Type': 'application/json',
    },
  };
}

export async function getTicket(id: string) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.get(`${base}/tickets/${id}`, { headers });
    return resp.data;
  } catch (error) {
    console.error('Error fetching Re:amaze ticket:', error);
    throw error;
  }
}

export async function createTicket(ticketData: any) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.post(`${base}/tickets`, ticketData, { headers });
    return resp.data;
  } catch (error) {
    console.error('Error creating Re:amaze ticket:', error);
    throw error;
  }
}

export async function updateTicket(id: string, ticketData: any) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.put(`${base}/tickets/${id}`, ticketData, { headers });
    return resp.data;
  } catch (error) {
    console.error('Error updating Re:amaze ticket:', error);
    throw error;
  }
}

export async function deleteTicket(id: string) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.delete(`${base}/tickets/${id}`, { headers });
    return resp.data;
  } catch (error) {
    console.error('Error deleting Re:amaze ticket:', error);
    throw error;
  }
}

export async function listTickets(queryParams: any = {}) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.get(`${base}/tickets`, {
      headers,
      params: queryParams,
    });
    return resp.data;
  } catch (error) {
    console.error('Error listing Re:amaze tickets:', error);
    throw error;
  }
}

export async function getTicketComments(ticketId: string) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.get(`${base}/tickets/${ticketId}/comments`, { headers });
    return resp.data;
  } catch (error) {
    console.error('Error fetching Re:amaze ticket comments:', error);
    throw error;
  }
}

export async function addTicketComment(ticketId: string, commentData: any) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.post(
      `${base}/tickets/${ticketId}/comments`,
      commentData,
      { headers }
    );
    return resp.data;
  } catch (error) {
    console.error('Error adding comment to Re:amaze ticket:', error);
    throw error;
  }
}

export async function updateTicketComment(ticketId: string, commentId: string, commentData: any) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.put(
      `${base}/tickets/${ticketId}/comments/${commentId}`,
      commentData,
      { headers }
    );
    return resp.data;
  } catch (error) {
    console.error('Error updating Re:amaze ticket comment:', error);
    throw error;
  }
}

export async function deleteTicketComment(ticketId: string, commentId: string) {
  const { base, headers } = getConfig();
  try {
    const resp = await axios.delete(
      `${base}/tickets/${ticketId}/comments/${commentId}`,
      { headers }
    );
    return resp.data;
  } catch (error) {
    console.error('Error deleting Re:amaze ticket comment:', error);
    throw error;
  }
}
