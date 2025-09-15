const User = require('../models/User');

async function upsertUserByZendeskId({ zendeskUserId, name, email, metadata }) {
  const filter = { zendeskUserId };
  const update = { name, email, metadata };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  return User.findOneAndUpdate(filter, update, options).exec();
}

module.exports = { upsertUserByZendeskId };
