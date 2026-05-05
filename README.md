# FinaceOrganizer back-end
API REST para sistema fullstack de dashboard financeiro

## Stack
- Node
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

## 📍 API Endpoints
A URL base para todas as requisições é `/api`. A maioria das rotas exige autenticação via token JWT no cabeçalho `Authorization: Bearer <token>`.

### 🩺 Health Check
Verifica se a API está online.
*   **`GET /health`** - Retorna o status da aplicação e a data atual.
  
### 🔐 Autenticação (`/auth`)
*   **`POST /auth/register`** - Registra um novo usuário.
*   **`POST /auth/login`** - Autentica um usuário e retorna o token JWT.
  
### 👤 Usuários (`/users`)
*   **`POST /users/`** - Registra um novo usuário (Rota alternativa).
*   **`POST /users/login`** - Autentica um usuário e retorna o token JWT (Rota alternativa).
*   **`GET /users/me`** - Retorna os dados do usuário logado *(Requer Autenticação)*.
*   **`GET /me`** - Atalho para os dados do usuário logado *(Requer Autenticação)*.
  
### 💸 Transações (`/transactions`)
*(Todas as rotas de transações exigem Autenticação)*
*   **`POST /transactions/`** - Cria uma nova transação (`INCOME` ou `EXPENSE`).
*   **`GET /transactions/`** - Lista as transações do usuário logado.
    *   **Filtros (Query Params):** 
        *   `limit` (ex: `?limit=10`) - Quantidade de itens por página.
        *   `page` (ex: `?page=1`) - Página atual.
        *   `category` (ex: `?category=LAZER`) - Filtra por categoria específica.
        *   `type` (ex: `?type=INCOME`) - Filtra por Receita ou Despesa.
        *   `period` (ex: `?period=30d`) - Filtra por período (`30d`, `3m`, `1y`).
        *   `description` (ex: `?description=Salário`) - Busca parcial pelo texto.
*   **`GET /transactions/summary`** - Retorna o saldo total, total de receitas e total de despesas globais.
*   **`GET /transactions/monthlySummary`** - Retorna o total de receitas e despesas apenas do **mês atual**.

