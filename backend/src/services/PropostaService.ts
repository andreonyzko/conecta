import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { PropostaRepository } from '../repositories/PropostaRepository';
import { ChamadaRepository } from '../repositories/ChamadaRepository';
import { JWTPayload } from '../helpers/tokenHelper';
import { normalizeProduto, quantidadeAtendidaPorProduto } from '../helpers/produtos';
import { CreatePropostaDto } from '../dto/proposta/create-proposta.dto';

function hoje(): string {
  return new Date().toISOString().split('T')[0];
}

@Injectable()
export class PropostaService {
  listar(filtro: { chamadaId?: string; agricultorId?: string }) {
    if (filtro.chamadaId) return PropostaRepository.findByChamada(filtro.chamadaId);
    if (filtro.agricultorId) return PropostaRepository.findByAgricultor(filtro.agricultorId);
    return PropostaRepository.find({ relations: ['itens'], order: { createdAt: 'DESC' } });
  }

  async findById(id: string) {
    const proposta = await PropostaRepository.findByIdComItens(id);
    if (!proposta) {
      throw new NotFoundException('Proposta nao encontrada');
    }
    return proposta;
  }

  async create(dto: CreatePropostaDto, user: JWTPayload) {
    const chamada = await ChamadaRepository.findOne({ where: { id: dto.chamadaId } });
    if (!chamada) {
      throw new NotFoundException('Chamada nao encontrada');
    }
    if (chamada.status !== 'ativa') {
      throw new BadRequestException('Nao e possivel enviar proposta para uma chamada que nao esta ativa');
    }

    const itens = dto.itens.map((item) => ({
      produto: item.produto,
      quantidade: item.quantidade,
      unidade: item.unidade,
      precoPorUnidade: item.precoPorUnidade,
      total: item.quantidade * item.precoPorUnidade,
    }));
    const valorTotal = itens.reduce((soma, item) => soma + item.total, 0);

    const proposta = PropostaRepository.create({
      chamadaId: dto.chamadaId,
      agricultorId: user.perfilId,
      realizaEntrega: dto.realizaEntrega ?? false,
      mensagem: dto.mensagem ?? '',
      valorTotal,
      status: 'pendente',
      dataCriacao: hoje(),
      itens,
    });

    return PropostaRepository.save(proposta);
  }

  /**
   * Regra (por quantidade): so bloqueia o item se a quantidade pedida na chamada
   * ja foi TOTALMENTE atendida por outras propostas aceitas. Permite fornecimento
   * parcial (ex.: pedido 100kg, aceitos 50kg -> outro agricultor pode fornecer o restante).
   */
  async aceitar(id: string, user: JWTPayload) {
    const proposta = await this.garantirDonaDaChamada(id, user);
    if (proposta.status !== 'pendente') {
      throw new BadRequestException('Apenas propostas pendentes podem ser aceitas');
    }

    const chamada = await ChamadaRepository.findByIdComItens(proposta.chamadaId);
    const aceitas = await PropostaRepository.findAceitasDaChamada(proposta.chamadaId);
    const atendido = quantidadeAtendidaPorProduto(
      aceitas.filter((p) => p.id !== proposta.id),
    );

    const bloqueados: string[] = [];
    for (const item of proposta.itens) {
      const itemChamada = chamada?.itens.find(
        (ci) => normalizeProduto(ci.produto) === normalizeProduto(item.produto),
      );
      if (!itemChamada) continue;
      const jaAtendido = atendido.get(normalizeProduto(item.produto)) ?? 0;
      if (jaAtendido >= itemChamada.quantidade) {
        bloqueados.push(item.produto);
      }
    }

    if (bloqueados.length > 0) {
      throw new BadRequestException(
        `Produtos com quantidade ja totalmente atendida nesta chamada: ${bloqueados.join(', ')}`,
      );
    }

    proposta.status = 'aceita';
    return PropostaRepository.save(proposta);
  }

  async rejeitar(id: string, user: JWTPayload) {
    const proposta = await this.garantirDonaDaChamada(id, user);
    if (proposta.status !== 'pendente') {
      throw new BadRequestException('Apenas propostas pendentes podem ser rejeitadas');
    }
    proposta.status = 'rejeitada';
    return PropostaRepository.save(proposta);
  }

  async cancelar(id: string, user: JWTPayload) {
    const proposta = await this.findById(id);
    if (user.role !== 'agricultor' || proposta.agricultorId !== user.perfilId) {
      throw new ForbiddenException('Voce so pode cancelar as suas proprias propostas');
    }
    await PropostaRepository.remove(proposta);
    return { message: 'Proposta cancelada com sucesso' };
  }

  /** Garante que o usuario logado e a instituicao dona da chamada da proposta. */
  private async garantirDonaDaChamada(id: string, user: JWTPayload) {
    const proposta = await this.findById(id);
    if (user.role !== 'instituicao' || proposta.chamada.instituicaoId !== user.perfilId) {
      throw new ForbiddenException('Voce so pode gerenciar propostas das suas chamadas');
    }
    return proposta;
  }
}
