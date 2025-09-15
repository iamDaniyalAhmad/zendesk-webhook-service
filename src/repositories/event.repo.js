const ProcessedEvent = require('../models/ProcessedEvent');

async function checkProcessed(key) {
  return ProcessedEvent.findOne({ key }).exec();
}

async function markProcessed(key, payloadHash) {
  return ProcessedEvent.create({ key, payloadHash });
}

module.exports = { checkProcessed, markProcessed };
