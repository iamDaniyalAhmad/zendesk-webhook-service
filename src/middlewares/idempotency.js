const crypto = require('crypto');
const { checkProcessed, markProcessed } = require('../repositories/event.repo');
const { logger } = require('../utils/logger');

const TTL_SECONDS = parseInt(process.env.IDEMPOTENCY_TTL_SECONDS || '86400', 10);

async function idempotencyMiddleware(req, res, next) {
  // Prefer explicit idempotency key header, else fallback to payload hash
  const keyHeader = req.get('Idempotency-Key') || req.get('idempotency-key');
  const payloadHash = crypto.createHash('sha256').update(req.rawBody || '').digest('hex');
  const key = keyHeader ? `idem:${keyHeader}` : `bodyhash:${payloadHash}`;

  const processed = await checkProcessed(key);
  if (processed) {
    logger.info('Duplicate webhook ignored', { key });
    // respond 200 with idempotent reply (optionally include last reply). For now return 200 with accepted.
    return res.status(200).json({ status: 'duplicate', message: 'Event already processed' });
  }

  // attach to req so handler can mark it after success
  req._idempotency = { key, payloadHash };
  next();
}

async function markIdempotent(req, res, next) {
  try {
    if (req._idempotency) {
      await markProcessed(req._idempotency.key, req._idempotency.payloadHash);
    }
  } catch (err) {
    logger.warn('Failed to mark event processed', { error: err.message });
  }
  next();
}

module.exports = { idempotencyMiddleware, markIdempotent };
