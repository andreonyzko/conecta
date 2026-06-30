# AgroConecta — Backend MVC (Server-Side Rendering)

Aplicação web server-side do AgroConecta, construída em **Express + EJS**, com autenticação
por sessão e renderização de views no servidor.

## Stack
- Express 4 + TypeScript
- TypeORM 0.3 (DataSource global — mesmas entidades do backend API)
- EJS (template engine server-side)
- express-session (autenticação por sessão, sem JWT)
- PostgreSQL (Neon) **ou** SQLite local (fallback automático)
- bcryptjs (hash de senhas)

## Como rodar (modo mais rápido — SQLite, zero setup)
```bash
cd backend-mvc
npm install
npm run dev
```
- App: http://localhost:3334

Sem `DATABASE_URL` configurada, o backend cria um arquivo `data.sqlite` local e gera o
schema automaticamente (`synchronize`).

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
   SESSION_SECRET=um-segredo-forte
   ```
3. `npm run dev` — agora usando PostgreSQL.

## Variáveis de ambiente (`.env`)
| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão 3334) |
| `DATABASE_URL` | Connection string Postgres. Vazio = usa SQLite local |
| `SESSION_SECRET` | Segredo da sessão (padrão: `agroconecta-secret`) |

## Autenticação
- **Sessão HTTP**: ao fazer login, o usuário é gravado em `req.session.user`. A sessão
  dura 8 horas.
- Rotas protegidas usam os middlewares `requireAuth` (precisa estar logado) e
  `requireRole('agricultor' | 'instituicao')` (verifica o perfil).
- Não há token JWT — o navegador envia automaticamente o cookie de sessão.

## Principais rotas
- **Auth**: `GET/POST /login`, `GET/POST /register`, `POST /logout`
- **Chamadas**: `GET /chamadas`, `GET/POST /chamadas/nova`, `GET /chamadas/:id`,
  `GET/PUT /chamadas/:id/editar`, `POST /chamadas/:id/cancelar`, `POST /chamadas/:id/encerrar`
- **Propostas**: `GET/POST /chamadas/:id/propostas/nova`, `POST /propostas/:id/aceitar`,
  `POST /propostas/:id/rejeitar`, `DELETE /propostas/:id`
- **Perfis**: `GET /perfil`, `POST /perfil` (agricultor e instituição)

## Scripts
| Comando | Ação |
|---|---|
| `npm run dev` | Sobe em modo desenvolvimento (ts-node-dev) |
| `npm run build` | Compila para `dist/` |
| `npm start` | Roda a versão compilada |
| `npm run seed` | Popula dados de exemplo |
