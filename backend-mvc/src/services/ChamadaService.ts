import { ChamadaRepository } from '../repositories/ChamadaRepository';
import { PropostaRepository } from '../repositories/PropostaRepository';
import { AvaliacaoRepository } from '../repositories/AvaliacaoRepository';
import { LicitacaoGanhaRepository } from '../repositories/LicitacaoGanhaRepository';
import { SessionUser } from '../types/session';
import { normalizeProduto, quantidadeAtendidaPorProduto } from '../helpers/produtos';
import { ChamadaStatus } from '../models/chamada';

function hoje(): string { return new Date().toISOString().split('T')[0]; }

export interface CreateChamadaInput {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  itens: { produto: string; categoria: string; quantidade: number; unidade: string; frequencia: string; precoReferencia: number }[];
}

export interface EncerrarInput {
  avaliacoes?: { agricultorId: string; nota: number; comentario?: string }[];
}

export class ChamadaService {
  findAll(filtro?: { status?: ChamadaStatus; instituicaoId?: string }) {
    return ChamadaRepository.findAllComItens(filtro);
  }

  async findById(id: string) {
    const chamada = await ChamadaRepository.findByIdComItens(id);
    if (!chamada) throw new Error('Chamada não encontrada.');
    return chamada;
  }

  async create(input: CreateChamadaInput, user: SessionUser) {
    if (user.role !== 'instituicao') throw new Error('Apenas instituições podem criar chamadas.');
    const chamada = ChamadaRepository.create({
      titulo: input.titulo, descricao: input.descricao,
      dataInicio: input.dataInicio, dataFim: input.dataFim,
      instituicaoId: user.perfilId, status: 'ativa',
      itens: input.itens.map(i => ({ ...i })),
    });
    return ChamadaRepository.save(chamada);
  }

  async update(id: string, input: Partial<CreateChamadaInput>, user: SessionUser) {
    const chamada = await this.garantirDona(id, user);
    Object.assign(chamada, input);
    return ChamadaRepository.save(chamada);
  }

  async cancelar(id: string, user: SessionUser) {
    const chamada = await this.garantirDona(id, user);
    if (chamada.status !== 'ativa') throw new Error('Apenas chamadas ativas podem ser canceladas.');
    chamada.status = 'cancelada';
    await ChamadaRepository.save(chamada);
    await PropostaRepository.update({ chamadaId: id }, { status: 'chamada_cancelada' });
  }

  async encerrar(id: string, input: EncerrarInput, user: SessionUser) {
    const chamada = await this.garantirDona(id, user);
    if (chamada.status !== 'ativa') throw new Error('Apenas chamadas ativas podem ser encerradas.');
    chamada.status = 'encerrada';
    await ChamadaRepository.save(chamada);

    const aceitas = await PropostaRepository.findAceitasDaChamada(id);
    for (const proposta of aceitas) {
      await LicitacaoGanhaRepository.save(LicitacaoGanhaRepository.create({
        agricultorId: proposta.agricultorId, chamadaId: chamada.id,
        instituicaoId: chamada.instituicaoId, valor: proposta.valorTotal, dataConclusao: hoje(),
      }));
    }

    for (const av of input.avaliacoes ?? []) {
      await AvaliacaoRepository.save(AvaliacaoRepository.create({
        agricultorId: av.agricultorId, instituicaoId: chamada.instituicaoId,
        chamadaId: chamada.id, nota: av.nota, comentario: av.comentario ?? '', data: hoje(),
      }));
    }
  }

  async getItensComStatus(id: string) {
    const chamada = await this.findById(id);
    const aceitas = await PropostaRepository.findAceitasDaChamada(id);
    const atendido = quantidadeAtendidaPorProduto(aceitas);
    return chamada.itens.map(item => {
      const quantidadeAtendida = atendido.get(normalizeProduto(item.produto)) ?? 0;
      const quantidadeRestante = Math.max(0, item.quantidade - quantidadeAtendida);
      return { ...item, quantidadeAtendida, quantidadeRestante, atendido: quantidadeRestante <= 0 };
    });
  }

  async chamadaTotalmenteAtendida(id: string): Promise<boolean> {
    const itens = await this.getItensComStatus(id);
    return itens.length > 0 && itens.every(i => i.atendido);
  }

  async getPropostas(id: string, user: SessionUser) {
    await this.garantirDona(id, user);
    return PropostaRepository.findByChamada(id);
  }

  private async garantirDona(id: string, user: SessionUser) {
    const chamada = await this.findById(id);
    if (user.role !== 'instituicao' || chamada.instituicaoId !== user.perfilId) {
      throw new Error('Você só pode gerenciar suas próprias chamadas.');
    }
    return chamada;
  }
}

export const chamadaService = new ChamadaService();
