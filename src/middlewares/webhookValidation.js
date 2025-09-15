// const crypto = require('crypto');

// function verifyWebhook(req, res, next) {
//   const sharedSecret = process.env.WEBHOOK_SHARED_SECRET;
//   if (!sharedSecret) return res.status(500).json({ error: 'Webhook secret not configured' });

//   const signatureHeader = req.get('x-webhook-signature') || req.get('x-zendesk-signature');
//   if (!signatureHeader) return res.status(401).json({ error: 'Missing signature header' });

//   // compute HMAC-SHA256 of raw body
//   const hmac = crypto.createHmac('sha256', sharedSecret);
//   const digest = hmac.update(req.rawBody || '').digest('hex');

//   if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader))) {
//     return res.status(401).json({ error: 'Invalid signature' });
//   }
//   next();
// }

// module.exports = { verifyWebhook };

const crypto = require('crypto');

function verifyWebhook(req, res, next) {
  const sharedSecret = process.env.WEBHOOK_SHARED_SECRET;
  if (!sharedSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const signatureHeader = req.get('x-webhook-signature') || req.get('x-zendesk-signature');
  if (!signatureHeader) {
    return res.status(401).json({ error: 'Missing signature header' });
  }

  // compute HMAC-SHA256 of raw body
  const hmac = crypto.createHmac('sha256', sharedSecret);
  const digest = hmac.update(req.rawBody || '').digest('hex');

  console.log("🔑 Shared secret:", sharedSecret);
  console.log("📦 Raw Body:", req.rawBody.toString());
  console.log("🖥️  Server digest:", digest);
  console.log("📩 Header signature:", signatureHeader);

  // normalize both values before comparison
  const normalizedDigest = digest.toLowerCase().trim();
  const normalizedHeader = signatureHeader.toLowerCase().trim();

  if (normalizedDigest !== normalizedHeader) {
    return res.status(401).json({
      error: 'Invalid signature',
      expected: normalizedDigest,
      received: normalizedHeader
    });
  }

  next();
}

module.exports = { verifyWebhook };
