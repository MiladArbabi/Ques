# Ques

Cross-platform customer-service automation for e-commerce.  
Unified helpdesk adapters, AI chat links, analytics dashboard.

## Architecture Overview

- **Flow**: User → Helpdesk Webhook → Ques Backend  
  - Auto-reply (Email/SMS) with Chat Link  
  - Customer clicks link → React Chat UI (frontend-web)  
- **Backend Services**: Re:amaze, Zendesk, Shopify, AI/NLP, Caching  
- **Frontend**: Dashboard (frontend-web), Mobile App (frontend-mobile)  
- **Infra**: MongoDB Atlas, Redis (Terraform)

```yaml
User → Helpdesk Webhook → Ques Backend
  ↳ Auto-reply (Email/SMS) with Chat Link
  ↳ Customer clicks link → React Chat UI
Backend: Re:amaze, Zendesk, Shopify, AI/NLP, Caching
Frontend: Dashboard (web), Mobile App
Infra: MongoDB Atlas, Redis (Terraform)
```

## Repo Layout

.
├── backend
│   ├── adapters        # Re:amaze & Zendesk API clients
│   ├── services        # Shopify, AI, Chat, Cache logic
│   ├── templates       # Email/SMS auto-reply content generator
│   ├── webhooks        # Express endpoint for ticket webhooks
│   ├── config          # getConfig() for env vars
│   ├── app.ts          # Express server entry point
│   ├── jest.config.js  # Jest + ts-jest configuration
│   └── package*.json
├── frontend-web        # Next.js PWA dashboard & chat UI
├── frontend-mobile     # Expo React Native mobile shell
├── infra/terraform     # IaC for MongoDB Atlas & Redis
├── .github/workflows   # CI pipeline (lint, test, coverage)
└── README.md           # This file

## Getting Started

### Prerequisites

- Node.js ≥16
- npm
- Terraform CLI (for infra)

### Environment Variables

Create a top-level `.env`:

REAMAZE_API_URL=https://your.reamaze.instance/api/v1
REAMAZE_API_KEY=REPLACE_ME

ZENDESK_API_URL=https://yourdomain.zendesk.com/api/v2
ZENDESK_EMAIL=you@domain.com
ZENDESK_API_TOKEN=REPLACE_ME

SHOPIFY_STORE_URL=https://your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=REPLACE_ME

MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/ques
REDIS_URL=redis://:password@redis-host:6379

PORT=3000

### Backend

```bash
cd backend
npm install
npm test           # Run unit tests
npm run coverage   # Generate coverage report (coverage/)
```

### Frontend (Web)

```bash
cd frontend-web
npm install
npm run dev        # http://localhost:3000
```

### Frontend (Mobile)

```bash
cd frontend-mobile
npm install
npm start          # Expo dev tools
```

### Scripts & Coverage

- `npm test`: Run Jest tests
- `npm run coverage`: Run tests + enforce thresholds
  - Branches ≥80%
  - Functions ≥85%
  - Lines & Statements ≥90%
- Coverage output: `backend/coverage/`

## Deployment

1. Apply Terraform in `infra/terraform` for MongoDB Atlas & Redis.
2. Deploy `backend` to Node host (Heroku, ECS, etc.).
3. Deploy `frontend-web` to Vercel/Netlify.
4. Publish `frontend-mobile` via App Stores.

## Next Steps

- Complete dashboard components (ticket volume, KPI cards, action cards).
- Build mobile notification feed and swipeable action cards.
- Pilot testing & feedback round.
- CI/CD: Auto-deploy from main branch.

© 2025 Ques — Automating your e-commerce customer service.
```

> **Note**: Confirm `npm test` and `npm run coverage` pass in `backend` before deployment.