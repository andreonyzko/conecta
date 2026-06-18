import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InstituicaoRepository } from '../repositories/InstituicaoRepository';
import { JWTPayload } from '../helpers/tokenHelper';
import { UpdateInstituicaoDto } from '../dto/instituicao/update-instituicao.dto';

@Injectable()
export class InstituicaoService {
  findAll() {
    return InstituicaoRepository.findAllOrdenadas();
  }

  async findById(id: string) {
    const instituicao = await InstituicaoRepository.findOne({
      where: { id },
      relations: ['chamadas'],
    });
    if (!instituicao) {
      throw new NotFoundException('Instituicao nao encontrada');
    }
    return instituicao;
  }

  async update(id: string, dto: UpdateInstituicaoDto, user: JWTPayload) {
    if (user.role !== 'instituicao' || user.perfilId !== id) {
      throw new ForbiddenException('Voce so pode alterar o seu proprio perfil');
    }
    const instituicao = await this.findById(id);
    Object.assign(instituicao, dto);
    return InstituicaoRepository.save(instituicao);
  }
}
