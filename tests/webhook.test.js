const request = require('supertest');
const app = require('../index');
const crypto = require('crypto');

function sign(body, secret) {
  return crypto.createHmac('sha256', secret).update(Buffer.from(JSON.stringify(body))).digest('hex');
}

describe('POST /webhook/message', () => {
  it('returns 200 and reply for a normal message', async () => {
    const body = {
      zendeskUserId: 'zd_test_1',
      name: 'Test User',
      email: 'test@example.com',
      text: 'Hello!'
    };
    const signature = sign(body, process.env.WEBHOOK_SHARED_SECRET);

    const res = await request(app)
      .post('/webhook/message')
      .set('x-webhook-signature', signature)
      .send(body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('text');
    expect(res.body).toHaveProperty('quick_replies');
  });

  it('rejects invalid signature', async () => {
    const body = { zendeskUserId: 'zd_test_2', name: 'X', email: 'x@x', text: 'x' };
    const res = await request(app)
      .post('/webhook/message')
      .set('x-webhook-signature', 'bad_sig')
      .send(body);

    expect(res.statusCode).toBe(401);
  });
});
