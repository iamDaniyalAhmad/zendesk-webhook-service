const axios = require('axios');
const { logger } = require('../utils/logger');

const MOCK = process.env.ZENDESK_MOCK === 'true';

class ZendeskClient {
  constructor() {
    this.baseUrl = process.env.ZENDESK_API_URL;
    this.token = process.env.ZENDESK_API_TOKEN;
  }

  async createTicket({ subject, description, requester }) {
    if (MOCK) {
      logger.info('ZendeskClient mock: createTicket', { subject, requester });
      // return a fake ticket id
      return { ticketId: `mock_ticket_${Date.now()}` };
    }

    // Example real implementation - adapt to your Zendesk REST API details
    const url = `${this.baseUrl}/tickets`;
    const body = {
      ticket: {
        subject,
        comment: { body: description },
        requester
      }
    };

    const resp = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    return { ticketId: resp.data?.ticket?.id || resp.data?.id };
  }
}

module.exports = new ZendeskClient();
