import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { PropostaRepository } from '../repositories/PropostaRepository';
import { ChamadaRepository } from '../repositories/ChamadaRepository';
import { JWTPayload } from '../helpers/tokenHelper';
import { produtosBloqueados } from '../helpers/produtos';
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
   * Regra: so aceita a proposta se nenhum dos seus produtos ja foi aceito em
   * outra proposta da mesma chamada.
   */
  async aceitar(id: string, user: JWTPayload) {
    const proposta = await this.garantirDonaDaChamada(id, user);
    if (proposta.status !== 'pendente') {
      throw new BadRequestException('Apenas propostas pendentes podem ser aceitas');
    }

    const aceitas = await PropostaRepository.findAceitasDaChamada(proposta.chamadaId);
    const produtosAceitos: string[] = [];
    for (const outra of aceitas) {
      if (outra.id === proposta.id) continue;
      for (const item of outra.itens) {
        produtosAceitos.push(item.produto);
      }
    }

    const bloqueados = produtosBloqueados(proposta.itens, produtosAceitos);

    if (bloqueados.length > 0) {
      throw new BadRequestException(
        `Produtos ja aceitos em outra proposta desta chamada: ${bloqueados.join(', ')}`,
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
