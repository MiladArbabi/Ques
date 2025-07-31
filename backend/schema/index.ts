// backend/schema/index.ts
import gql from 'graphql-tag';
import { ZendeskAPI } from '../adapters/zendesk';
import { ReamazeAPI }  from '../adapters/reamaze';
import { classifyMessage } from '../services/ai';
import { generateChatLink } from '../services/chat/session';
import { getOrder } from '../services/shopify';

export const typeDefs = gql`
  type Ticket {
    id: ID!
    subject: String!
    source: String!
  }

  type Classification {
    category: String!
  }

  type Order {
    id: ID!
    total: Float!
  }

  type Query {
    tickets(source: String!): [Ticket!]!
    order(orderId: String!): Order!
  }

  type Mutation {
    classifyMessage(text: String!): Classification!
    createSession(ticketId: String!): String!
  }
`;

export const resolvers = {
  Query: {
    tickets: async (
      _parent: any,
      { source }: { source: string },
      { dataSources }: { dataSources: { zendeskAPI: ZendeskAPI; reamazeAPI: ReamazeAPI } }
    ) => {
      console.log(`[tickets resolver] source=${source}`, 
                  'available dataSources:', Object.keys(dataSources));
      try {
        let tickets;
        if (source === 'zendesk') {
          tickets = await dataSources.zendeskAPI.listTickets();
        } else if (source === 'reamaze') {
          tickets = await dataSources.reamazeAPI.listTickets();
        } else {
          throw new Error(`Unknown source: ${source}`);
        }
        return tickets.map(t => ({ ...t, source }));
      } catch (err) {
        console.error(`[tickets resolver] error for "${source}":`, err);
        throw new Error(`Failed fetching ${source} tickets: ${(err as Error).message}`);
      }
    },
    order: async (_: any, { orderId }: { orderId: string }) => {
      return await getOrder(orderId);
    }
  },

  Mutation: {
    classifyMessage: async (_: any, { text }: { text: string }) => {
      const { category } = await classifyMessage(text);
      return { category };
    },
    createSession: (_: any, { ticketId }: { ticketId: string }) => {
      return generateChatLink(ticketId);
    }
  }
}
