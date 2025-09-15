const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sender: { type: String, enum: ['user', 'system', 'agent'], default: 'user' },
  text: { type: String, required: true },
  metadata: mongoose.Schema.Types.Mixed,
  externalTicketId: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
