import express from 'express';
import ticketWebhook from './webhooks/tickets';
const app = express();
app.use(express.json());
app.use('/webhook', ticketWebhook);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(\`Server listening on \${port}\`));
