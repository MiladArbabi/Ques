import express from 'express';
const router = express.Router();

router.post('/tickets', async (req, res) => {
  const ticket = req.body;
  // TODO: enqueue for auto-reply processing
  console.log('New ticket webhook received:', ticket);
  res.status(200).send('OK');
});

export default router;
