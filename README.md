# Termflow

AI lettings platform for purpose-built student accommodation. Live at [termflow.ai](https://termflow.ai).

Termflow handles the lettings journey from first enquiry to move-in. An AI agent talks to prospective tenants over WhatsApp, email and web chat, books viewings, takes applications, sends contracts for e-signature and collects payments, with one-click approval for the landlord at each stage.

## Stack

- TypeScript throughout: React and Vite on the front end, Node.js and Express on the back end
- PostgreSQL with Drizzle ORM
- OpenAI for the conversational agent
- Twilio for WhatsApp and SMS
- Stripe for deposits and payments
- Google sign-in, e-signed contracts, A/B testing of message templates

## Running locally

```
npm install
cp .env.example .env   # add your own keys
npm run dev
```

Built by Harry Beaumont.
