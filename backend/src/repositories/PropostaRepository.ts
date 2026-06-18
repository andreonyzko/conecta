import { AppDataBase } from '../db';
import { Proposta } from '../models/proposta';

export const PropostaRepository = AppDataBase.getRepository(Proposta).extend({
  findByChamada(chamadaId: string) {
    return this.find({
      where: { chamadaId },
      relations: ['itens', 'agricultor'],
      order: { createdAt: 'DESC' },
    });
  },

  findByAgricultor(agricultorId: string) {
    return this.find({
      where: { agricultorId },
      relations: ['itens', 'chamada'],
      order: { createdAt: 'DESC' },
    });
  },

  findByIdComItens(id: string) {
    return this.findOne({
      where: { id },
      relations: ['itens', 'agricultor', 'chamada'],
    });
  },

  /** Propostas aceitas de uma chamada (para regras de produto ja aceito / encerramento). */
  findAceitasDaChamada(chamadaId: string) {
    return this.find({
      where: { chamadaId, status: 'aceita' },
      relations: ['itens'],
    });
  },
});
