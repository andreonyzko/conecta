import { AppDataBase } from '../db';
import { Agricultor } from '../models/agricultor';

const RELATIONS = ['produtos', 'avaliacoes', 'licitacoesGanhas'];

export const AgricultorRepository = AppDataBase.getRepository(Agricultor).extend({
  findAllComRelacoes() {
    return this.find({ relations: RELATIONS, order: { nome: 'ASC' } });
  },

  findByIdComRelacoes(id: string) {
    return this.findOne({ where: { id }, relations: RELATIONS });
  },
});
