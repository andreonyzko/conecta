import { PropostaRepository } from '../repositories/PropostaRepository';
import { ChamadaRepository } from '../repositories/ChamadaRepository';
import { SessionUser } from '../types/session';
import { normalizeProduto, quantidadeAtendidaPorProduto } from '../helpers/produtos';

function hoje(): string { return new Date().toISOString().split('T')[0]; }

export interface CreatePropostaInput {
  chamadaId: string;
  realizaEntrega?: boolean;
  mensagem?: string;
  itens: { produto: string; quantidade: number; unidade: string; precoPorUnidade: number }[];
}

export class PropostaService {
  listar(filtro: { chamadaId?: string; agricultorId?: string }) {
    if (filtro.chamadaId) return PropostaRepository.findByChamada(filtro.chamadaId);
    if (filtro.agricultorId) return PropostaRepository.findByAgricultor(filtro.agricultorId);
    return PropostaRepository.find({ relations: ['itens'], order: { createdAt: 'DESC' } });
  }

  async findById(id: string) {
    const p = await PropostaRepository.findByIdComItens(id);
    if (!p) throw new Error('Proposta não encontrada.');
    return p;
  }

  async create(input: CreatePropostaInput, user: SessionUser) {
    if (user.role !== 'agricultor') throw new Error('Apenas agricultores podem enviar propostas.');
    const chamada = await ChamadaRepository.findOne({ where: { id: input.chamadaId } });
    if (!chamada) throw new Error('Chamada não encontrada.');
    if (chamada.status !== 'ativa') throw new Error('Chamada não está ativa.');

    const itens = input.itens.map(i => ({
      produto: i.produto, quantidade: i.quantidade, unidade: i.unidade,
      precoPorUnidade: i.precoPorUnidade, total: i.quantidade * i.precoPorUnidade,
    }));
    const valorTotal = itens.reduce((s, i) => s + i.total, 0);

    return PropostaRepository.save(PropostaRepository.create({
      chamadaId: input.chamadaId, agricultorId: user.perfilId,
      realizaEntrega: input.realizaEntrega ?? false,
      mensagem: input.mensagem ?? '', valorTotal,
      status: 'pendente', dataCriacao: hoje(), itens,
    }));
  }

  async aceitar(id: string, user: SessionUser) {
    const proposta = await this.garantirDonaDaChamada(id, user);
    if (proposta.status !== 'pendente') throw new Error('Apenas propostas pendentes podem ser aceitas.');

    const chamada = await ChamadaRepository.findByIdComItens(proposta.chamadaId);
    const aceitas = await PropostaRepository.findAceitasDaChamada(proposta.chamadaId);
    const atendido = quantidadeAtendidaPorProduto(aceitas.filter(p => p.id !== proposta.id));

    const bloqueados: string[] = [];
    for (const item of proposta.itens) {
      const itemChamada = chamada?.itens.find(ci => normalizeProduto(ci.produto) === normalizeProduto(item.produto));
      if (!itemChamada) continue;
      if ((atendido.get(normalizeProduto(item.produto)) ?? 0) >= itemChamada.quantidade) {
        bloqueados.push(item.produto);
      }
    }
    if (bloqueados.length > 0) throw new Error(`Quantidade já totalmente atendida: ${bloqueados.join(', ')}`);

    proposta.status = 'aceita';
    return PropostaRepository.save(proposta);
  }

  async rejeitar(id: string, user: SessionUser) {
    const proposta = await this.garantirDonaDaChamada(id, user);
    if (proposta.status !== 'pendente') throw new Error('Apenas propostas pendentes podem ser rejeitadas.');
    proposta.status = 'rejeitada';
    return PropostaRepository.save(proposta);
  }

  async cancelar(id: string, user: SessionUser) {
    const proposta = await this.findById(id);
    if (user.role !== 'agricultor' || proposta.agricultorId !== user.perfilId) {
      throw new Error('Você só pode cancelar suas próprias propostas.');
    }
    await PropostaRepository.remove(proposta);
  }

  private async garantirDonaDaChamada(id: string, user: SessionUser) {
    const proposta = await this.findById(id);
    if (user.role !== 'instituicao' || proposta.chamada.instituicaoId !== user.perfilId) {
      throw new Error('Você só pode gerenciar propostas das suas chamadas.');
    }
    return proposta;
  }
}

export const propostaService = new PropostaService();
