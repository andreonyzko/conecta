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

const entities = [
  Usuario, Agricultor, Instituicao, Produto, Avaliacao,
  LicitacaoGanha, Chamada, ItemChamada, Proposta, ItemProposta,
];

const databaseUrl = process.env.DATABASE_URL;

const dataSourceOptions: DataSourceOptions = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      entities,
      synchronize: true,
      logging: false,
      extra: { max: 5, connectionTimeoutMillis: 10000, idleTimeoutMillis: 10000 },
    }
  : {
      type: 'sqljs',
      location: path.join(__dirname, '..', 'data.sqlite'),
      autoSave: true,
      entities,
      synchronize: true,
      logging: false,
    };

export const AppDataBase = new DataSource(dataSourceOptions);
