import { AppDataBase } from '../db';
import { LicitacaoGanha } from '../models/licitacaoGanha';

export const LicitacaoGanhaRepository = AppDataBase.getRepository(LicitacaoGanha).extend({
  findByAgricultor(agricultorId: string) {
    return this.find({ where: { agricultorId }, order: { createdAt: 'DESC' } });
  },
});
