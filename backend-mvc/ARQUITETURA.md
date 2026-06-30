# Arquitetura do Backend MVC — AgroConecta

Documento explicativo da construção e da arquitetura da aplicação web server-side do AgroConecta.

---

## 1. Visão geral

O AgroConecta MVC é a **interface web** do sistema, onde agricultores e instituições interagem
diretamente pelo navegador. As páginas são geradas no servidor (server-side rendering) e
enviadas prontas ao cliente — não há SPA nem chamadas AJAX em separado.

O sistema cobre o mesmo domínio do backend API: chamadas públicas para fornecimento de
alimentos (inspirado no PNAE), propostas de agricultores e gestão das instituições compradoras.
A diferença está na camada de apresentação: aqui o servidor renderiza HTML com **EJS** em vez
de retornar JSON.

---

## 2. Stack tecnológica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Linguagem | **TypeScript** | Tipagem estática, consistência com o restante do projeto |
| Framework | **Express 4** | Leve, sem opinião sobre estrutura — montagem manual em MVC |
| ORM | **TypeORM** | Mesmas entidades do backend API — reaproveitamento de modelos |
| Template engine | **EJS** | Server-side rendering com sintaxe próxima ao HTML puro |
| Autenticação | **express-session** + **bcryptjs** | Sessão HTTP clássica, sem JWT |
| Formulários PUT/DELETE | **method-override** | HTML só suporta GET/POST; `_method` emula os demais verbos |
| Banco | **PostgreSQL** (Neon) | Banco relacional na nuvem; sem `DATABASE_URL` usa SQLite local |

---

## 3. Padrão arquitetural: MVC

O projeto segue o padrão **Model — View — Controller**, com uma camada de Service
intermediária entre Controller e Repository:

```
   Navegador
        │  HTTP (cookie de sessão)
        ▼
 ┌──────────────────────────────────────────────┐
 │ 1. requireAuth / requireRole  → middleware    │  (segurança)
 ├──────────────────────────────────────────────┤
 │ 2. Router       → direciona a rota            │  (roteamento)
 │ 3. Controller   → recebe req, chama service   │  (camada web)
 │ 4. Service      → aplica a regra de negócio   │  (domínio)
 │ 5. Repository   → acessa o banco (TypeORM)    │  (persistência)
 │ 6. Model/Entity → tabela do PostgreSQL        │  (dados)
 ├──────────────────────────────────────────────┤
 │ 7. View (EJS)   → renderiza o HTML final      │  (apresentação)
 └──────────────────────────────────────────────┘
        │  HTML pronto
        ▼
   Navegador
```

- **Router**: define os caminhos e verbos HTTP e conecta ao controller correto.
- **Controller**: recebe `req`/`res`, extrai parâmetros, chama o service e chama `res.render()`
  (ou `res.redirect()`). Não contém lógica de negócio.
- **Service**: concentra as regras de negócio (ex.: só a instituição dona pode cancelar a
  chamada). Idêntico em responsabilidade ao service do backend API.
- **Repository**: encapsula o acesso a dados com consultas TypeORM customizadas.
- **Model (Entity)**: classes decoradas que mapeiam para tabelas no banco — compartilhadas
  conceitualmente com o backend API.
- **View (EJS)**: templates `.ejs` com partials reutilizáveis (navbar, flash, etc.). Recebem
  um objeto de dados do controller e geram o HTML final.

---

## 4. Estrutura de pastas

```
backend-mvc/src/
├── app.ts             # ponto de entrada: sobe o Express, sessão, rotas
├── db.ts              # conexão com o banco (DataSource do TypeORM)
├── models/            # entidades (tabelas) — mesmas 10 do backend API
├── repositories/      # acesso a dados (consultas TypeORM customizadas)
├── services/          # regras de negócio
├── controllers/       # handlers das rotas HTTP
├── routes/            # definição das rotas (vincula path → controller)
├── views/             # templates EJS
│   ├── partials/      # cabeçalho, navbar, flash (reutilizados em toda view)
│   ├── auth/          # login.ejs, register.ejs
│   ├── chamadas/      # index, show, new, edit, encerrar
│   ├── propostas/     # new, show
│   ├── agricultor/    # perfil do agricultor
│   ├── instituicao/   # perfil da instituição
│   └── erro.ejs       # página de erro genérica (404 e 403)
├── middleware/        # requireAuth, requireRole
├── helpers/           # utilitários de domínio (regra de produtos)
├── types/             # extensão de tipos (SessionUser em req.session)
└── seeds/             # script para popular dados de exemplo
```

---

## 5. Modelo de dados (10 tabelas)

As entidades são as mesmas do backend API:

| Tabela | Descrição |
|---|---|
| `usuarios` | Conta de acesso (email, senha hash, perfil) |
| `agricultores` | Dados do agricultor familiar |
| `instituicoes` | Dados da instituição compradora |
| `produtos` | Produtos que cada agricultor oferece |
| `chamadas` | Editais/chamadas públicas criadas pelas instituições |
| `itens_chamada` | Itens (produtos demandados) de cada chamada |
| `propostas` | Propostas enviadas pelos agricultores às chamadas |
| `itens_proposta` | Itens (produtos ofertados) de cada proposta |
| `avaliacoes` | Avaliações que as instituições dão aos agricultores |
| `licitacoes_ganhas` | Registro das propostas vencedoras |

---

## 6. Autenticação e autorização (sessão)

- **Registro/Login**: a senha é gravada com hash **bcrypt** (nunca em texto puro). Ao fazer
  login com sucesso, o objeto `SessionUser` (id, email, role, perfilId, nome) é gravado em
  `req.session.user`. A sessão dura **8 horas**.
- O cookie de sessão é enviado automaticamente pelo navegador em cada requisição seguinte —
  não há token JWT nem cabeçalho `Authorization`.
- **`requireAuth`**: middleware que redireciona para `/login` se não houver sessão ativa.
- **`requireRole('agricultor' | 'instituicao')`**: middleware que verifica o perfil do
  usuário logado. Retorna HTTP 403 com a view de erro se o perfil não bater.
- Rotas públicas (ex.: listar chamadas) não usam esses middlewares.

---

## 7. Formulários e method-override

HTML nativo só suporta `GET` e `POST`. Para usar `PUT` e `DELETE` em formulários, o projeto
usa o pacote **method-override**: um campo oculto `<input name="_method" value="DELETE">`
no formulário instrui o middleware a tratar a requisição como `DELETE`, permitindo que as
rotas sigam o padrão REST mesmo dentro de um app server-side.

---

## 8. Regras de negócio

As mesmas do backend API, implementadas nos services:

1. **Cancelar chamada em cascata**: ao cancelar, todas as propostas da chamada passam para
   `chamada_cancelada` automaticamente.
2. **Encerrar chamada**: gera uma `licitacao_ganha` para cada proposta aceita e registra
   as avaliações dos agricultores.
3. **Não aceitar proposta com produto já comprado**: ao aceitar uma proposta, verifica se
   algum dos seus produtos já foi aceito em outra proposta da mesma chamada.
4. **Itens com status**: calcula quantidade atendida e restante por produto dentro da chamada.
5. **Restrição de perfil nos services**: os services verificam o perfil do usuário logado
   (ex.: só a instituição dona da chamada pode cancelá-la ou encerrá-la).

---

## 9. Rotas

| Grupo | Rotas |
|---|---|
| Auth | `GET /login`, `POST /login`, `GET /register`, `POST /register`, `POST /logout` |
| Chamadas | `GET /chamadas`, `GET /chamadas/nova`, `POST /chamadas`, `GET /chamadas/:id` |
| | `GET /chamadas/:id/editar`, `PUT /chamadas/:id`, `POST /chamadas/:id/cancelar` |
| | `GET /chamadas/:id/encerrar`, `POST /chamadas/:id/encerrar` |
| Propostas | `GET /chamadas/:id/propostas/nova`, `POST /chamadas/:id/propostas` |
| | `POST /propostas/:id/aceitar`, `POST /propostas/:id/rejeitar`, `DELETE /propostas/:id` |
| Perfis | `GET /perfil`, `POST /perfil` |

---

## 10. Como executar

```bash
cd backend-mvc
npm install
npm run seed   # (opcional) popula dados de exemplo — senha dos usuários: senha123
npm run dev    # sobe a aplicação
```

- App: `http://localhost:3334`

O banco é definido pelo arquivo `.env` (PostgreSQL/Neon via `DATABASE_URL`); sem ele, usa
SQLite local automaticamente.
