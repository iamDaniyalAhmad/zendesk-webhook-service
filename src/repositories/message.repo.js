const Message = require('../models/Message');

async function createMessage(payload) {
  return Message.create(payload);
}

module.exports = { createMessage };
