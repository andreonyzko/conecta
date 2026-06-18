import { AppDataBase } from '../db';
import { Avaliacao } from '../models/avaliacao';

export const AvaliacaoRepository = AppDataBase.getRepository(Avaliacao).extend({
  findByAgricultor(agricultorId: string) {
    return this.find({ where: { agricultorId }, order: { createdAt: 'DESC' } });
  },
});
