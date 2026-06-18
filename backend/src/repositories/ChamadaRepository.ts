import { AppDataBase } from '../db';
import { Chamada } from '../models/chamada';
import { ChamadaStatus } from '../models/chamada';

export const ChamadaRepository = AppDataBase.getRepository(Chamada).extend({
  findAllComItens(filtro?: { status?: ChamadaStatus; instituicaoId?: string }) {
    const where: Record<string, unknown> = {};
    if (filtro?.status) where.status = filtro.status;
    if (filtro?.instituicaoId) where.instituicaoId = filtro.instituicaoId;
    return this.find({
      where,
      relations: ['itens', 'instituicao'],
      order: { createdAt: 'DESC' },
    });
  },

  findByIdComItens(id: string) {
    return this.findOne({ where: { id }, relations: ['itens', 'instituicao'] });
  },
});
