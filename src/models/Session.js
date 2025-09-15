const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zendeskUserId: { type: String, required: true },
  lastActiveAt: { type: Date, default: Date.now },
  ticketId: String, // Zendesk ticket id if escalated
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

SessionSchema.index({ zendeskUserId: 1 });

module.exports = mongoose.model('Session', SessionSchema);
