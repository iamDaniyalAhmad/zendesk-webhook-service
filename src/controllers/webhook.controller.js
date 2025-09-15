const { logger } = require('../utils/logger');
const messageService = require('../services/message.service');

async function handleMessage(req, res) {
  // validate payload
  const body = req.body || {};
  const { zendeskUserId, name, email, text, payload } = body;

  if (!zendeskUserId || !name || !email || !text) {
    return res.status(400).json({ error: 'Missing required fields: zendeskUserId, name, email, text' });
  }

  // process
  try {
    const result = await messageService.handleIncomingWebhook({ zendeskUserId, name, email, text, payload });
    return res.status(200).json(result.reply);
  } catch (err) {
    logger.error('Failed to handle webhook', { error: err.message });
    throw err; // let global error handler do the response
  }
}

module.exports = { handleMessage };
