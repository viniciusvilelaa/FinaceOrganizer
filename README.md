# FinanceOrganizer Backend
API REST para o sistema fullstack de dashboard financeiro.

## Stack
- Node.js (ES Modules)
- Express 5
- Prisma 6
- MySQL / MariaDB
- bcryptjs + jsonwebtoken
- cookie-parser
- Helmet + CORS + Morgan
- express-rate-limit

## Setup

1. Configure as variaveis de ambiente criando um arquivo `.env` na raiz do projeto com base no modelo abaixo:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=2h
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

2. Execute os comandos para instalar as dependencias, gerar o client do Prisma, rodar as migracoes e iniciar a API:
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm start
```

Base URL local: `http://localhost:3000/api`

## Autenticacao
A API utiliza Cookies HttpOnly para gerenciar as sessoes dos usuarios de forma segura contra ataques XSS.

- Cookie de sessao: `auth_token`
- Parametros do cookie: `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `maxAge: 7 dias`, `path: '/'`.
- Em ambiente de desenvolvimento local, o frontend se conecta ao backend usando proxy para garantir que a transmissao do cookie ocorra de forma transparente na mesma origem.

## API Endpoints
A URL base para todas as requisicoes e `/api`.

### Rota de Health Check
Verifica se a API esta online e respondendo.
- `GET /health` - Retorna o status da aplicacao e a data atual.

### Autenticacao e Usuarios (/users)
- `POST /users/` - Registra um novo usuario e define o cookie de autenticacao.
- `POST /users/login` - Autentica um usuario e define o cookie de autenticacao.
- `POST /users/logout` - Realiza o logout do usuario removendo o cookie de autenticacao.
- `GET /users/me` - Retorna os dados do usuario logado (Requer Autenticacao).

### Transacoes (/transactions)
Todas as rotas abaixo exigem autenticacao.
- `POST /transactions/` - Cria uma nova transacao (INCOME ou EXPENSE).
- `GET /transactions/` - Lista as transacoes do usuario logado.
  - Filtros disponiveis via Query Params:
    - `limit` (ex: `?limit=10`) - Limita a quantidade de itens por pagina.
    - `page` (ex: `?page=1`) - Define a pagina atual.
    - `category` (ex: `?category=LAZER`) - Filtra por categoria especifica.
    - `type` (ex: `?type=INCOME`) - Filtra por Receita ou Despesa.
    - `period` (ex: `?period=30d`) - Filtra por periodo (30d, 3m, 1y).
    - `description` (ex: `?description=Salario`) - Busca por termo na descricao.
- `GET /transactions/summary` - Retorna o saldo total, total de receitas e despesas gerais.
- `GET /transactions/monthlySummary` - Retorna o total de receitas e despesas apenas do mes atual.
- `GET /transactions/getChartData` - Retorna a agregacao de saldo e despesas dos ultimos 6 meses para exibicao de graficos.
- `GET /transactions/getPizzaData` - Retorna os gastos totais agrupados por categoria.

### Metas Financeiras (/goals)
Todas as rotas abaixo exigem autenticacao.
- `POST /goals/` - Cria uma nova meta financeira.
- `GET /goals/current` - Retorna a meta financeira ativa do usuario.
- `GET /goals/history` - Retorna o historico de metas do usuario.
