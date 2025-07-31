// backend/schema/autoReply.graphql.ts
import gql from 'graphql-tag';

export const autoReplyTypeDefs = gql`
  extend type Mutation {
    sendAutoReply(
      ticketId: ID!
      email: String!
      phone: String!
      name: String
    ): Boolean!
  }
`;

export const autoReplyResolvers = {
  Mutation: {
    sendAutoReply: async (_: any, args: { ticketId: string; email: string; phone: string; name?: string }) => {
      await sendAutoReply({
        ticketId: args.ticketId,
        toEmail: args.email,
        toPhone: args.phone,
        customerName: args.name,
      });
      return true;
    },
  },
};
