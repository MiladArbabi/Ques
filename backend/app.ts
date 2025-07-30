// backend/app.ts
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { ZendeskAPI } from './adapters/zendesk';
import { ReamazeAPI } from './adapters/reamaze';

async function start(): Promise<void> {
  // 1) Create Express app
  const app = express();

  // 2) Create ApolloServer instance
   const server = new ApolloServer({
    typeDefs,
    resolvers,
    // use ApolloServer's built‑in dataSources hook, not context
    dataSources: (() => ({
      zendeskAPI: new ZendeskAPI(),
      reamazeAPI: new ReamazeAPI(),
    })) as any,
    formatError: ({ message }) => ({ message }),
    debug: false,
   })

  // 3) Start Apollo & apply as Express middleware
  await server.start();
  ;(server as any).applyMiddleware({ app, path: '/graphql' });

  // 4) Listen
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`🚀  Server ready at http://localhost:${port}/graphql`);
  });
}

// kick it off
start().catch((err: unknown) => {
  console.error('Startup failed', err);
  process.exit(1);
});
