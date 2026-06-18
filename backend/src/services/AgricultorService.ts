import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { AgricultorRepository } from '../repositories/AgricultorRepository';
import { ProdutoRepository } from '../repositories/ProdutoRepository';
import { AvaliacaoRepository } from '../repositories/AvaliacaoRepository';
import { JWTPayload } from '../helpers/tokenHelper';
import { UpdateAgricultorDto } from '../dto/agricultor/update-agricultor.dto';
import { CreateProdutoDto } from '../dto/agricultor/create-produto.dto';
import { UpdateProdutoDto } from '../dto/agricultor/update-produto.dto';

@Injectable()
export class AgricultorService {
  findAll() {
    return AgricultorRepository.findAllComRelacoes();
  }

  async findById(id: string) {
    const agricultor = await AgricultorRepository.findByIdComRelacoes(id);
    if (!agricultor) {
      throw new NotFoundException('Agricultor nao encontrado');
    }
    return agricultor;
  }

  async update(id: string, dto: UpdateAgricultorDto, user: JWTPayload) {
    this.garantirDono(id, user);
    const agricultor = await this.findById(id);
    Object.assign(agricultor, dto);
    return AgricultorRepository.save(agricultor);
  }

  async listarProdutos(agricultorId: string) {
    await this.findById(agricultorId);
    return ProdutoRepository.findByAgricultor(agricultorId);
  }

  async addProduto(agricultorId: string, dto: CreateProdutoDto, user: JWTPayload) {
    this.garantirDono(agricultorId, user);
    await this.findById(agricultorId);
    const produto = ProdutoRepository.create({ ...dto, agricultorId });
    return ProdutoRepository.save(produto);
  }

  async updateProduto(
    agricultorId: string,
    produtoId: string,
    dto: UpdateProdutoDto,
    user: JWTPayload,
  ) {
    this.garantirDono(agricultorId, user);
    const produto = await ProdutoRepository.findOne({
      where: { id: produtoId, agricultorId },
    });
    if (!produto) {
      throw new NotFoundException('Produto nao encontrado');
    }
    Object.assign(produto, dto);
    return ProdutoRepository.save(produto);
  }

  async removeProduto(agricultorId: string, produtoId: string, user: JWTPayload) {
    this.garantirDono(agricultorId, user);
    const produto = await ProdutoRepository.findOne({
      where: { id: produtoId, agricultorId },
    });
    if (!produto) {
      throw new NotFoundException('Produto nao encontrado');
    }
    await ProdutoRepository.remove(produto);
    return { message: 'Produto removido com sucesso' };
  }

  async listarAvaliacoes(agricultorId: string) {
    await this.findById(agricultorId);
    return AvaliacaoRepository.findByAgricultor(agricultorId);
  }

  /** Garante que o usuario logado e o proprio agricultor. */
  private garantirDono(agricultorId: string, user: JWTPayload) {
    if (user.role !== 'agricultor' || user.perfilId !== agricultorId) {
      throw new ForbiddenException('Voce so pode alterar o seu proprio perfil');
    }
  }
}
