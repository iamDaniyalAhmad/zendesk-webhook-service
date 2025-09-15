# Zendesk Webhook Service (Express + Mongo)

A small microservice that accepts Zendesk-style webhooks, persists user/session/message data and optionally escalates to a Zendesk ticket.

## Features
- POST /webhook/message
- Schema: upsert User + Session, persist Message
- HMAC webhook validation (X-WEBHOOK-SIGNATURE)
- Idempotency (Idempotency-Key header or payload hash)
- Mockable Zendesk client (ZENDESK_MOCK=true)
- Structured logging (winston)
- Docker + docker-compose for local dev
- Basic tests with jest + supertest

## Quick start (local)
1. Copy `.env.example` to `.env` and edit values.
2. Start with Docker Compose:
