<<<<<<< HEAD
# FinaceOrganizer
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

1. Copie `.env.example` para `.env`
2. Ajuste `DATABASE_URL` e `JWT_SECRET`
3. Rode os comandos:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Base URL: `http://localhost:3333/api`

## Endpoints iniciais

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me` (Bearer Token)
>>>>>>> b9951a9 (Initial project config with prisma models)
