# AgroConecta — Backend (API REST)

API REST do AgroConecta, construída em **NestJS + TypeORM**, conectando agricultores
familiares e instituições por meio de chamadas públicas (editais) e propostas.

## Stack
- NestJS 11 (Express) + TypeScript
- TypeORM 0.3 (DataSource global, estilo "puro")
- PostgreSQL (Neon) **ou** SQLite local (fallback automático)
- Autenticação JWT (jsonwebtoken + bcryptjs)
- Documentação Swagger

## Como rodar (modo mais rápido — SQLite, zero setup)
```bash
cd backend
npm install
npm run dev
```
- API: http://localhost:3333/api
- Swagger: http://localhost:3333/api/docs

Sem `DATABASE_URL` configurada, o backend cria um arquivo `data.sqlite` local e gera o
schema automaticamente (`synchronize`). Ideal para desenvolvimento e demonstração.

### (Opcional) Popular com dados de exemplo
```bash
npm run seed
```
Cria instituições, agricultores, uma chamada e uma proposta. Senha de todos os usuários
de exemplo: `senha123`.

## Usar PostgreSQL (Neon)
1. Crie um banco no [Neon](https://neon.tech) e copie a connection string.
2. Copie `.env.example` para `.env` e preencha:
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
   JWT_SECRET=um-segredo-forte
   ```
3. `npm run dev` — agora usando PostgreSQL.

## Variáveis de ambiente (`.env`)
| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão 3333) |
| `NODE_ENV` | `development` / `production` |
| `ALLOWED_ORIGINS` | Origens CORS separadas por vírgula (vazio = libera todas) |
| `DATABASE_URL` | Connection string Postgres. Vazio = usa SQLite local |
| `JWT_SECRET` | Segredo do JWT |
| `JWT_EXPIRES_IN` | Validade do token (ex.: `7d`) |

## Autenticação
1. `POST /api/auth/register` ou `POST /api/auth/login` → retorna `accessToken`.
2. Envie o token nas demais rotas: `Authorization: Bearer <accessToken>`.
3. Dois perfis: `agricultor` e `instituicao` (controlam o acesso às rotas).

## Principais rotas
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Agricultores**: `GET/PUT /api/agricultores`, produtos em `/api/agricultores/:id/produtos`
- **Instituições**: `GET/PUT /api/instituicoes`
- **Chamadas**: `GET/POST /api/chamadas`, `PUT /api/chamadas/:id/cancelar`,
  `PUT /api/chamadas/:id/encerrar`, `GET /api/chamadas/:id/itens-disponiveis`
- **Propostas**: `GET/POST /api/propostas`, `PUT /api/propostas/:id/aceitar`,
  `PUT /api/propostas/:id/rejeitar`, `DELETE /api/propostas/:id`

Documentação interativa completa no Swagger (`/api/docs`).

## Regras de negócio
- **Cancelar chamada**: marca a chamada como `cancelada` e todas as propostas como
  `chamada_cancelada`.
- **Encerrar chamada**: gera uma licitação ganha para cada proposta aceita e registra as
  avaliações dos agricultores.
- **Aceitar proposta**: bloqueia se algum produto já foi aceito em outra proposta da mesma
  chamada.

## Scripts
| Comando | Ação |
|---|---|
| `npm run dev` | Sobe em modo desenvolvimento (ts-node-dev) |
| `npm run build` | Compila para `dist/` |
| `npm start` | Roda a versão compilada |
| `npm run seed` | Popula dados de exemplo |
| `npm test` | Roda os testes (Jest) |
