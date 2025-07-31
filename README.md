# Ques

Cross‑platform, modular customer‑service automation for e‑commerce.

## Modular Architecture

Que! is built as a set of independent, plug‑and‑play modules that can be adopted and extended as needed:

* **Communication Connectors**
  Integrations with Zendesk, Re\:amaze, email, SMS, and social channels to unify all customer conversations in one place.

* **AI Automation Core**
  NLP‑powered message classification, auto‑reply templates, and workflow automation for returns, refunds, and common inquiries.

* **Social Media Scheduler**
  Plan, queue, and publish posts across Facebook, Twitter, Instagram, and more; includes calendar view and multi‑account support.

* **Inventory & Warehouse Module**
  Mobile‑first camera capture for receiving, stowing, picking, packing, and shipping; syncs with Shopify inventory data.

* **GraphQL API**
  Unified schema exposing tickets, orders, draft orders, social posts, and warehouse tasks. Supports both queries and mutations for each domain.

### Fetch an order by ID
query GetOrder($orderId: String!) {
  order(orderId: $orderId) {
    id
    total
  }
}

Response:
{
  "data": {
    "order": {
      "id": "42",
      "total": 123.45
    }
  }
}

***Frontend UIs**

  * **Dashboard (Next.js PWA)**: Real‑time analytics for tickets/orders, chat interface, and social calendar view.
  * **Mobile App (Expo)**: On‑the‑go notifications, warehouse workflows, and post scheduling.

## Repo Layout

* **backend/** — Node.js microservices, adapters, GraphQL schema and resolvers, and AI automation services.
* **frontend-web/** — Next.js Progressive Web App dashboard.
* **frontend-mobile/** — Expo‑based React Native app for warehouse & chat workflows.

## Getting Started

1. Clone & install dependencies for each folder.
2. Create a `.env` based on `.env.example`, providing API keys for Zendesk, Re\:amaze, Shopify, Redis, etc.
3. Run services in parallel:

   * `npm run dev` in **backend/**
   * `npm run dev` in **frontend-web/**
   * `expo start` in **frontend-mobile/**

## Contributing

* Follow our TDD workflow: write failing tests first.
* Use feature branches: `feature/<short‑desc>`.
* Open pull requests against `develop` branch.

## Code of Conduct

See [CODE\_OF\_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.
