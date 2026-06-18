# Arquitetura do Backend — AgroConecta API

Documento explicativo da construção e da arquitetura da API REST do AgroConecta.

---

## 1. Visão geral

O AgroConecta é uma plataforma que conecta **agricultores familiares** a **instituições**
(escolas, institutos) por meio de **chamadas públicas** (editais) para fornecimento de
alimentos — inspirado no PNAE (Programa Nacional de Alimentação Escolar).

O backend é uma **API REST** que expõe todas as operações do sistema (cadastro, autenticação,
chamadas, propostas, avaliações) para serem consumidas por um aplicativo mobile (Expo/React
Native) e/ou por um front web.

---

## 2. Stack tecnológica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Linguagem | **TypeScript** | Tipagem estática, mesma linguagem do app mobile |
| Framework | **NestJS** (sobre Express) | Organização em módulos, injeção de dependência, decorators |
| ORM | **TypeORM** | Mapeamento objeto-relacional, entidades como classes |
| Banco | **PostgreSQL** (Neon) | Banco relacional; na nuvem para o app acessar |
| Autenticação | **JWT** (`jsonwebtoken`) + **bcryptjs** | Tokens stateless + hash seguro de senhas |
| Validação | **class-validator** | Validação declarativa dos dados de entrada |
| Documentação | **Swagger** (`@nestjs/swagger`) | Documentação interativa gerada automaticamente |

> Em desenvolvimento, se não houver `DATABASE_URL` configurada, o projeto usa **SQLite** (via
> `sql.js`, em WebAssembly) automaticamente — permite rodar sem instalar nada.

---

## 3. Arquitetura em camadas

O backend segue uma arquitetura **em camadas**, com responsabilidades bem separadas
(Controller → Service → Repository → Model). Cada requisição percorre o seguinte fluxo:

```
   Cliente (app / navegador / Swagger)
        │  HTTP  (Authorization: Bearer <token>)
        ▼
 ┌──────────────────────────────────────────────┐
 │ 1. AuthGuard      → valida o token JWT         │  (segurança)
 │ 2. RolesGuard     → confere o perfil (@Roles)  │
 ├──────────────────────────────────────────────┤
 │ 3. ValidationPipe → valida o corpo (DTO)       │  (entrada)
 ├──────────────────────────────────────────────┤
 │ 4. Controller     → recebe a requisição HTTP   │  (camada web)
 │ 5. Service        → aplica a regra de negócio  │  (domínio)
 │ 6. Repository     → acessa o banco (TypeORM)   │  (persistência)
 │ 7. Model/Entity   → tabela do PostgreSQL       │  (dados)
 └──────────────────────────────────────────────┘
        │  resposta JSON  (ou erro padronizado pelo HttpExceptionFilter)
        ▼
   Cliente
```

- **Controller**: define as rotas (verbos HTTP, caminhos) e delega ao service. Não contém
  lógica de negócio.
- **Service**: concentra as regras de negócio (ex.: validar se uma proposta pode ser aceita).
- **Repository**: encapsula o acesso a dados (consultas TypeORM). Padrão único via
  `AppDataBase.getRepository(Entidade).extend({ ...consultas customizadas })`.
- **Model (Entity)**: classe decorada que vira uma tabela no banco.
- **DTO**: classe que descreve e **valida** o formato dos dados que entram na API.

---

## 4. Estrutura de pastas

```
backend/src/
├── main.ts            # ponto de entrada: sobe o servidor, CORS, Swagger, validação global
├── db.ts              # conexão com o banco (DataSource do TypeORM) + lista de entidades
├── config/            # configurações (segredo e validade do JWT)
├── models/            # entidades (tabelas)
├── repositories/      # acesso a dados (consultas)
├── services/          # regras de negócio
├── controllers/       # rotas HTTP
├── dto/               # validação dos dados de entrada
├── middlewares/       # guards de autenticação/perfil, filtro de erros, decorators
├── helpers/           # utilitários (assinar token, regra de produtos)
├── modules/           # módulos NestJS que amarram controller + service
└── seeds/             # script para popular dados de exemplo
```

---

## 5. Modelo de dados (10 tabelas)

| Tabela | Descrição |
|---|---|
| `usuarios` | Conta de acesso (email, senha, perfil) — liga-se a um agricultor **ou** instituição |
| `agricultores` | Dados do agricultor familiar |
| `instituicoes` | Dados da instituição compradora |
| `produtos` | Produtos que cada agricultor oferece |
| `chamadas` | Editais/chamadas públicas criadas pelas instituições |
| `itens_chamada` | Itens (produtos demandados) de cada chamada |
| `propostas` | Propostas enviadas pelos agricultores às chamadas |
| `itens_proposta` | Itens (produtos ofertados) de cada proposta |
| `avaliacoes` | Avaliações que as instituições dão aos agricultores |
| `licitacoes_ganhas` | Registro das propostas vencedoras |

### Relacionamentos

- **1 para N (um-para-muitos):**
  - Uma **instituição** tem várias **chamadas**.
  - Uma **chamada** tem vários **itens** (e várias propostas).
  - Um **agricultor** tem vários **produtos**.
  - Uma **proposta** tem vários **itens**.

- **N para N (muitos-para-muitos):**
  - **Agricultores ↔ Chamadas** através da tabela **`propostas`** (um agricultor faz proposta
    para várias chamadas; uma chamada recebe propostas de vários agricultores). É uma tabela
    associativa **com atributos próprios** (mensagem, valor, status).
  - **Instituições ↔ Agricultores** através da tabela **`avaliacoes`**.

> Convenções: chave primária `uuid`, colunas de auditoria (`createdAt`/`updatedAt`),
> exclusão em cascata nas FKs (ex.: apagar uma chamada apaga seus itens).

---

## 6. Autenticação e autorização

- **Cadastro/Login** (`/api/auth/register`, `/api/auth/login`): a senha é gravada com **hash
  bcrypt** (nunca em texto puro). O login devolve um **token JWT**.
- O token é enviado nas demais rotas no cabeçalho `Authorization: Bearer <token>`.
- **`AuthGuard`** (global): valida o token e identifica o usuário em toda requisição protegida.
- **Dois perfis de usuário** (`agricultor` e `instituicao`), controlados por **`RolesGuard`** +
  o decorator `@Roles(...)`. Exemplos de regras de acesso:
  - Só **instituição** cria/cancela/encerra chamadas e aceita/rejeita propostas.
  - Só **agricultor** envia/cancela propostas e gerencia seus produtos.
  - Cada usuário só altera o **próprio** perfil.
- Rotas marcadas com `@Public()` (ex.: listar chamadas) dispensam token.

---

## 7. Validação, erros e documentação

- **Validação de entrada**: cada rota recebe um **DTO** com regras `class-validator`
  (campos obrigatórios, e-mail válido, tamanho mínimo de senha, etc.). O `ValidationPipe`
  global rejeita dados inválidos com **HTTP 400**.
- **Tratamento de erros**: um **filtro global** (`HttpExceptionFilter`) padroniza todas as
  respostas de erro no formato:
  ```json
  { "statusCode": 400, "message": "...", "error": "Bad Request",
    "timestamp": "...", "path": "/api/..." }
  ```
- **Documentação**: o **Swagger** gera documentação interativa em **`/api/docs`**, listando
  todas as rotas, parâmetros, exemplos e permitindo testar com o token.

---

## 8. Regra de negócio (além do CRUD)

O sistema não é apenas CRUD. As principais regras implementadas:

1. **Não aceitar proposta com produto já comprado**: ao aceitar uma proposta, o sistema
   verifica se algum dos seus produtos **já foi aceito em outra proposta da mesma chamada**.
   Se já foi, a operação é bloqueada (HTTP 400) — evita comprar o mesmo item duas vezes.
2. **Cancelar chamada em cascata**: ao cancelar uma chamada, **todas as propostas** dela passam
   automaticamente para o status `chamada_cancelada`.
3. **Encerrar chamada**: ao encerrar, o sistema gera uma **licitação ganha** para cada proposta
   aceita e registra as **avaliações** dos agricultores.
4. **Itens disponíveis**: calcula quais itens da chamada ainda não foram atendidos por nenhuma
   proposta aceita.

---

## 9. Padrão REST

A API segue o padrão REST: recursos no plural, uso correto dos verbos HTTP e códigos de status.

| Recurso | Exemplos |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Agricultores | `GET /api/agricultores`, `PUT /api/agricultores/:id`, `POST /api/agricultores/:id/produtos` |
| Instituições | `GET /api/instituicoes`, `PUT /api/instituicoes/:id` |
| Chamadas | `GET/POST /api/chamadas`, `PUT /api/chamadas/:id/cancelar`, `PUT /api/chamadas/:id/encerrar` |
| Propostas | `GET/POST /api/propostas`, `PUT /api/propostas/:id/aceitar`, `DELETE /api/propostas/:id` |

---

## 10. Como executar

```bash
cd backend
npm install
npm run seed   # (opcional) popula dados de exemplo — senha dos usuários: senha123
npm run dev    # sobe a API
```

- API: `http://localhost:3333/api`
- Documentação (Swagger): `http://localhost:3333/api/docs`

O banco é definido pelo arquivo `.env` (PostgreSQL/Neon via `DATABASE_URL`); sem ele, usa
SQLite local automaticamente.
