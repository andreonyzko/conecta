import { InstituicaoRepository } from '../repositories/InstituicaoRepository';
import { SessionUser } from '../types/session';

export class InstituicaoService {
  findAll() { return InstituicaoRepository.findAllOrdenadas(); }

  async findById(id: string) {
    const i = await InstituicaoRepository.findOne({ where: { id }, relations: ['chamadas'] });
    if (!i) throw new Error('Instituição não encontrada.');
    return i;
  }

  async update(id: string, dto: any, user: SessionUser) {
    if (user.role !== 'instituicao' || user.perfilId !== id) throw new Error('Acesso negado.');
    const i = await this.findById(id);
    Object.assign(i, dto);
    return InstituicaoRepository.save(i);
  }
}

export const instituicaoService = new InstituicaoService();
