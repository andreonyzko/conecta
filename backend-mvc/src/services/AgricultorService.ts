import { AgricultorRepository } from '../repositories/AgricultorRepository';
import { ProdutoRepository } from '../repositories/ProdutoRepository';
import { AvaliacaoRepository } from '../repositories/AvaliacaoRepository';
import { SessionUser } from '../types/session';

export class AgricultorService {
  findAll() { return AgricultorRepository.findAllComRelacoes(); }

  async findById(id: string) {
    const a = await AgricultorRepository.findByIdComRelacoes(id);
    if (!a) throw new Error('Agricultor não encontrado.');
    return a;
  }

  async update(id: string, dto: any, user: SessionUser) {
    if (user.role !== 'agricultor' || user.perfilId !== id) throw new Error('Acesso negado.');
    const a = await this.findById(id);
    Object.assign(a, dto);
    return AgricultorRepository.save(a);
  }

  async addProduto(agricultorId: string, dto: any, user: SessionUser) {
    if (user.role !== 'agricultor' || user.perfilId !== agricultorId) throw new Error('Acesso negado.');
    return ProdutoRepository.save(ProdutoRepository.create({ ...dto, agricultorId }));
  }

  async removeProduto(agricultorId: string, produtoId: string, user: SessionUser) {
    if (user.role !== 'agricultor' || user.perfilId !== agricultorId) throw new Error('Acesso negado.');
    const p = await ProdutoRepository.findOne({ where: { id: produtoId, agricultorId } });
    if (!p) throw new Error('Produto não encontrado.');
    await ProdutoRepository.remove(p);
  }

  listarAvaliacoes(id: string) { return AvaliacaoRepository.findByAgricultor(id); }
}

export const agricultorService = new AgricultorService();
