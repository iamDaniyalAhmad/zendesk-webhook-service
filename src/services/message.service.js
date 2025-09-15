const userRepo = require('../repositories/user.repo');
const sessionRepo = require('../repositories/session.repo');
const messageRepo = require('../repositories/message.repo');
const zendeskService = require('./zendesk.service');
const { logger } = require('../utils/logger');

async function handleIncomingWebhook({ zendeskUserId, name, email, text, payload }) {
  // upsert user
  const user = await userRepo.upsertUserByZendeskId({ zendeskUserId, name, email });

  // upsert session
  const session = await sessionRepo.upsertSessionForUser({ userId: user._id, zendeskUserId });

  // save message
  const message = await messageRepo.createMessage({
    session: session._id,
    user: user._id,
    sender: 'user',
    text
  });

  let ticketId = null;
  if (payload === 'escalate_to_agent') {
    ticketId = await zendeskService.escalateToAgent({ text, user });
    // attach ticketId to session and message
    session.ticketId = ticketId;
    await session.save();
    message.externalTicketId = ticketId;
    await message.save();
  }

  logger.info('Processed incoming message', { sessionId: session._id.toString(), messageId: message._id.toString(), ticketId });
  return {
    reply: {
      text: ticketId ? 'Your request is escalated. An agent will reach out shortly.' : 'Thanks — we got your message. How can we help more?',
      quick_replies: ticketId ? ['Cancel', 'More info'] : ['Check balance', 'Speak to agent']
    },
    ticketId
  };
}

module.exports = { handleIncomingWebhook };
