import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

import { Usuario } from './models/usuario';
import { Agricultor } from './models/agricultor';
import { Instituicao } from './models/instituicao';
import { Produto } from './models/produto';
import { Avaliacao } from './models/avaliacao';
import { LicitacaoGanha } from './models/licitacaoGanha';
import { Chamada } from './models/chamada';
import { ItemChamada } from './models/itemChamada';
import { Proposta } from './models/proposta';
import { ItemProposta } from './models/itemProposta';

dotenv.config();

// Lista manual de entidades (estilo TypeORM "puro", sem @nestjs/typeorm).
// Toda nova entidade precisa ser adicionada aqui.
const entities = [
  Usuario,
  Agricultor,
  Instituicao,
  Produto,
  Avaliacao,
  LicitacaoGanha,
  Chamada,
  ItemChamada,
  Proposta,
  ItemProposta,
];

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

// Se houver DATABASE_URL -> PostgreSQL (ex.: Neon). Caso contrario -> SQLite local,
// para que o backend rode sem nenhum setup externo.
const dataSourceOptions: DataSourceOptions = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      entities,
      synchronize: !isProd,
      logging: false,
    }
  : {
      // SQLite em WebAssembly (sql.js): 100% JavaScript, sem build nativo.
      type: 'sqljs',
      location: path.join(__dirname, '..', 'data.sqlite'),
      autoSave: true,
      entities,
      synchronize: true,
      logging: false,
    };

export const AppDataBase = new DataSource(dataSourceOptions);
