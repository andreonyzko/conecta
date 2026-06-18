import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { ChamadaRepository } from '../repositories/ChamadaRepository';
import { PropostaRepository } from '../repositories/PropostaRepository';
import { AvaliacaoRepository } from '../repositories/AvaliacaoRepository';
import { LicitacaoGanhaRepository } from '../repositories/LicitacaoGanhaRepository';
import { JWTPayload } from '../helpers/tokenHelper';
import { normalizeProduto } from '../helpers/produtos';
import { ChamadaStatus } from '../models/chamada';
import { CreateChamadaDto } from '../dto/chamada/create-chamada.dto';
import { EncerrarChamadaDto } from '../dto/chamada/encerrar-chamada.dto';

function hoje(): string {
  return new Date().toISOString().split('T')[0];
}

@Injectable()
export class ChamadaService {
  findAll(filtro?: { status?: ChamadaStatus; instituicaoId?: string }) {
    return ChamadaRepository.findAllComItens(filtro);
  }

  async findById(id: string) {
    const chamada = await ChamadaRepository.findByIdComItens(id);
    if (!chamada) {
      throw new NotFoundException('Chamada nao encontrada');
    }
    return chamada;
  }

  async create(dto: CreateChamadaDto, user: JWTPayload) {
    const chamada = ChamadaRepository.create({
      titulo: dto.titulo,
      descricao: dto.descricao,
      dataInicio: dto.dataInicio,
      dataFim: dto.dataFim,
      instituicaoId: user.perfilId,
      status: 'ativa',
      itens: dto.itens.map((item) => ({ ...item })),
    });
    return ChamadaRepository.save(chamada);
  }

  /** Regra: cancelar chamada -> propostas viram 'chamada_cancelada'. */
  async cancelar(id: string, user: JWTPayload) {
    const chamada = await this.garantirDona(id, user);
    if (chamada.status !== 'ativa') {
      throw new BadRequestException('Apenas chamadas ativas podem ser canceladas');
    }

    chamada.status = 'cancelada';
    await ChamadaRepository.save(chamada);
    await PropostaRepository.update({ chamadaId: id }, { status: 'chamada_cancelada' });

    return { message: 'Chamada cancelada com sucesso' };
  }

  /**
   * Regra: encerrar chamada -> para cada proposta aceita gera uma LicitacaoGanha;
   * registra as avaliacoes enviadas para os agricultores.
   */
  async encerrar(id: string, dto: EncerrarChamadaDto, user: JWTPayload) {
    const chamada = await this.garantirDona(id, user);
    if (chamada.status !== 'ativa') {
      throw new BadRequestException('Apenas chamadas ativas podem ser encerradas');
    }

    chamada.status = 'encerrada';
    await ChamadaRepository.save(chamada);

    const aceitas = await PropostaRepository.findAceitasDaChamada(id);
    for (const proposta of aceitas) {
      await LicitacaoGanhaRepository.save(
        LicitacaoGanhaRepository.create({
          agricultorId: proposta.agricultorId,
          chamadaId: chamada.id,
          instituicaoId: chamada.instituicaoId,
          valor: proposta.valorTotal,
          dataConclusao: hoje(),
        }),
      );
    }

    for (const avaliacao of dto.avaliacoes ?? []) {
      await AvaliacaoRepository.save(
        AvaliacaoRepository.create({
          agricultorId: avaliacao.agricultorId,
          instituicaoId: chamada.instituicaoId,
          chamadaId: chamada.id,
          nota: avaliacao.nota,
          comentario: avaliacao.comentario ?? '',
          data: hoje(),
        }),
      );
    }

    return {
      message: 'Chamada encerrada com sucesso',
      licitacoesGeradas: aceitas.length,
      avaliacoesRegistradas: dto.avaliacoes?.length ?? 0,
    };
  }

  /** Produtos (normalizados) ja aceitos em alguma proposta da chamada. */
  async getProdutosAceitos(id: string): Promise<string[]> {
    const aceitas = await PropostaRepository.findAceitasDaChamada(id);
    const set = new Set<string>();
    for (const proposta of aceitas) {
      for (const item of proposta.itens) {
        set.add(normalizeProduto(item.produto));
      }
    }
    return Array.from(set);
  }

  /** Itens da chamada que ainda nao foram aceitos em nenhuma proposta. */
  async getItensDisponiveis(id: string) {
    const chamada = await this.findById(id);
    const aceitos = new Set(await this.getProdutosAceitos(id));
    return chamada.itens.filter((item) => !aceitos.has(normalizeProduto(item.produto)));
  }

  async getPropostas(id: string, user: JWTPayload) {
    await this.garantirDona(id, user);
    return PropostaRepository.findByChamada(id);
  }

  /** Garante que o usuario logado e a instituicao dona da chamada. */
  private async garantirDona(id: string, user: JWTPayload) {
    const chamada = await this.findById(id);
    if (user.role !== 'instituicao' || chamada.instituicaoId !== user.perfilId) {
      throw new ForbiddenException('Voce so pode gerenciar as suas proprias chamadas');
    }
    return chamada;
  }
}
