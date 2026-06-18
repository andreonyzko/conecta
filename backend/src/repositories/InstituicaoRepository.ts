import { AppDataBase } from '../db';
import { Instituicao } from '../models/instituicao';

export const InstituicaoRepository = AppDataBase.getRepository(Instituicao).extend({
  findAllOrdenadas() {
    return this.find({ order: { nome: 'ASC' } });
  },
});
