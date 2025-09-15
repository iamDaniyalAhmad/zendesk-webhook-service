require('dotenv').config();
require('express-async-errors'); // handle async errors automatically
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const webhookRoute = require('./src/api/routes/webhook.route');
const { errorHandler } = require('./src/middlewares/errorHandler');
const { logger } = require('./src/utils/logger');

const app = express();

// We need raw body for HMAC verification. Use express.json with verify to keep raw buffer.
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use('/webhook', webhookRoute);

// global error handler
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zendesk_webhook';

mongoose.connect(MONGO_URI, {
}).then(() => {
  logger.info('Connected to MongoDB');
  app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
}).catch(err => {
  logger.error('MongoDB connection error', { error: err.message });
  process.exit(1);
});

module.exports = app; // for testing
