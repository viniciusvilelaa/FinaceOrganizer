# FinaceOrganizer back-end
Sistema web para organização financeira com React + Express Js
=======
# FinanceOrganizer API

Esqueleto de backend com Express + Prisma + MySQL para Node 24.

## Stack

- Express 5
- Prisma 7
- MySQL
- JWT + bcrypt
- Helmet + CORS + Morgan

## Setup

1. Ajuste `DATABASE_URL` e `JWT_SECRET`
2. Rode os comandos:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Base URL: `http://localhost:3333/api`

## Endpoints iniciais

- `GET /api/health`
- `POST /api/users`
- `POST /api/users/login`
- `GET /api/users/me` (Bearer Token)
- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/transactions/summary`
- `GET /api/transactions/:id`
- `DELETE /api/transactions/:id`
