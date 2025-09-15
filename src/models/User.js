const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  zendeskUserId: { type: String, unique: true, index: true },
  name: String,
  email: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
