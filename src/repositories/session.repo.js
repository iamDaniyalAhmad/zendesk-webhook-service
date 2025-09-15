const Session = require('../models/Session');

async function upsertSessionForUser({ userId, zendeskUserId, metadata }) {
  const filter = { zendeskUserId };
  const update = { user: userId, lastActiveAt: new Date(), metadata };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  return Session.findOneAndUpdate(filter, update, options).exec();
}

module.exports = { upsertSessionForUser };
