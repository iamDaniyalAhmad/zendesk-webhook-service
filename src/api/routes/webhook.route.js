const express = require('express');
const router = express.Router();
const { verifyWebhook } = require('../../middlewares/webhookValidation');
const { idempotencyMiddleware, markIdempotent } = require('../../middlewares/idempotency');
const webhookController = require('../../controllers/webhook.controller');

// main endpoint
router.post('/message', verifyWebhook, idempotencyMiddleware, webhookController.handleMessage, markIdempotent);

module.exports = router;
