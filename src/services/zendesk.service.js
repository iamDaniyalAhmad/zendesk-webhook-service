const zendeskClient = require('../lib/zendeskClient');
const { logger } = require('../utils/logger');

async function escalateToAgent({ text, user }) {
  const subject = `Escalation from ${user.name} (${user.email})`;
  const description = text;
  const requester = { name: user.name, email: user.email };

  const resp = await zendeskClient.createTicket({ subject, description, requester });
  logger.info('Zendesk ticket created', { ticketId: resp.ticketId });
  return resp.ticketId;
}

module.exports = { escalateToAgent };
