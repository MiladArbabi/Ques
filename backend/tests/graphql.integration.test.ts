// backend/tests/graphql.integration.test.ts
import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';

import { typeDefs, resolvers } from '../schema/index';

// point at your adapters folder, not dataSources:
import { ZendeskAPI } from '../adapters/zendesk';
import { ReamazeAPI }  from '../adapters/reamaze';

describe('GraphQL Tickets Query', () => {
  let server: ApolloServer;

  const mockZendesk = [
    { id: '1', subject: 'Z1' },
    { id: '2', subject: 'Z2' },
  ];
  const mockReamaze = [
    { id: 'a', subject: 'R1' },
    { id: 'b', subject: 'R2' },
  ];

  beforeAll(() => {
    const zendeskMock = { listTickets: jest.fn().mockResolvedValue(mockZendesk) } as any as ZendeskAPI;
    const reamazeMock = { listTickets: jest.fn().mockResolvedValue(mockReamaze) } as any as ReamazeAPI;

    server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: (() => ({
        zendeskAPI: zendeskMock,
        reamazeAPI: reamazeMock,
      }) as any
    )
  });
})

  const CLASSIFY = gql`
    mutation Classify($text: String!) {
      classifyMessage(text: $text) { category }
    }
  `;

  const GET_TICKETS = gql`
    query Tickets($source: String!) {
      tickets(source: $source) {
        id
        subject
        source
      }
    }
  `;

  it('resolves Zendesk tickets', async () => {
    const { query } = createTestClient(server as any);
    const res = await query({ query: GET_TICKETS, variables: { source: 'zendesk' } });

    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      tickets: mockZendesk.map(t => ({ ...t, source: 'zendesk' })),
    });
  });

  it('resolves Re:amaze tickets', async () => {
    const { query } = createTestClient(server as any);
    const res = await query({ query: GET_TICKETS, variables: { source: 'reamaze' } });

    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      tickets: mockReamaze.map(t => ({ ...t, source: 'reamaze' })),
    });
  });

  it('errors on unknown source', async () => {
    const { query } = createTestClient(server as any);
    const res = await query({
      query: gql`query { tickets(source: "foo") { id } }`
    });
    expect(res.errors).toHaveLength(1);
    expect(res.data).toBeNull();
  });

  it('classifies via AI stub', async () => {
    const { mutate } = createTestClient(server as any);
    const res = await mutate({ mutation: CLASSIFY, variables: { text: 'refund' } });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({ classifyMessage: { category: 'support' } });
  });

    it('classifies a message via AI stub', async () => {
    const { mutate } = createTestClient(server as any);
    const res = await mutate({
      mutation: CLASSIFY,
      variables: { text: 'I would like a refund please' }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({ classifyMessage: { category: 'support' } });
    });
  })
