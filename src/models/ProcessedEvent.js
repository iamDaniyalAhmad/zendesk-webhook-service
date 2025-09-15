const mongoose = require('mongoose');

const ProcessedEventSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true, index: true }, // idempotency key or hash
  payloadHash: String,
  processedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ProcessedEvent', ProcessedEventSchema);
