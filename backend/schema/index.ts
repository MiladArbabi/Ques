// backend/schema/index.ts
import { gql } from 'apollo-server';
import { ZendeskAPI } from '../adapters/zendesk';
import { ReamazeAPI }  from '../adapters/reamaze';

export const typeDefs = gql`
  type Ticket {
    id: ID!
    subject: String!
    source: String!
  }

  type Query {
    tickets(source: String!): [Ticket!]!
  }
`;

export const resolvers = {
  Query: {
    tickets: async (
      _parent: any,
      { source }: { source: string },
      { dataSources }: { dataSources: { zendeskAPI: ZendeskAPI; reamazeAPI: ReamazeAPI } }
    ) => {
      let tickets;
      if (source === 'zendesk') {
        tickets = await dataSources.zendeskAPI.listTickets();
      } else if (source === 'reamaze') {
        tickets = await dataSources.reamazeAPI.listTickets();
      } else {
        throw new Error(`Unknown source: ${source}`);
      }
      // attach the source to each ticket
      return tickets.map(t => ({ ...t, source }));
    },
  },
};
