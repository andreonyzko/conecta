import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { authConfig } from '../config/auth';
import { signToken, JWTPayload } from '../helpers/tokenHelper';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { AgricultorRepository } from '../repositories/AgricultorRepository';
import { InstituicaoRepository } from '../repositories/InstituicaoRepository';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';

@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    const existente = await UsuarioRepository.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException('Ja existe um usuario com este email');
    }

    let perfilId: string;
    let perfil: unknown;

    if (dto.role === 'agricultor') {
      const agricultor = await AgricultorRepository.save(
        AgricultorRepository.create({
          nome: dto.nome,
          cpf: dto.cpfCnpj,
          caf: dto.caf ?? '',
          telefone: dto.telefone,
          email: dto.email,
          realizaEntrega: false,
        }),
      );
      perfilId = agricultor.id;
      perfil = agricultor;
    } else {
      const instituicao = await InstituicaoRepository.save(
        InstituicaoRepository.create({
          nome: dto.nome,
          cnpj: dto.cpfCnpj,
          telefone: dto.telefone,
          email: dto.email,
          numeroAlunos: dto.numeroAlunos ?? 0,
        }),
      );
      perfilId = instituicao.id;
      perfil = instituicao;
    }

    const senhaHash = await bcrypt.hash(dto.senha, authConfig.bcryptRounds);
    const usuario = await UsuarioRepository.save(
      UsuarioRepository.create({
        email: dto.email,
        senha: senhaHash,
        role: dto.role,
        agricultorId: dto.role === 'agricultor' ? perfilId : null,
        instituicaoId: dto.role === 'instituicao' ? perfilId : null,
      }),
    );

    const accessToken = signToken({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      perfilId,
    });

    return { perfil, accessToken };
  }

  async login(dto: LoginDto) {
    const usuario = await UsuarioRepository.findByEmailWithSenha(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const senhaOk = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaOk) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const perfilId = (usuario.agricultorId ?? usuario.instituicaoId) as string;
    const perfil = await this.carregarPerfil(usuario.role, perfilId);

    const accessToken = signToken({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      perfilId,
    });

    return { perfil, accessToken };
  }

  async me(payload: JWTPayload) {
    const perfil = await this.carregarPerfil(payload.role, payload.perfilId);
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      perfil,
    };
  }

  private async carregarPerfil(role: JWTPayload['role'], perfilId: string) {
    const perfil =
      role === 'agricultor'
        ? await AgricultorRepository.findByIdComRelacoes(perfilId)
        : await InstituicaoRepository.findOne({
            where: { id: perfilId },
            relations: ['chamadas'],
          });

    if (!perfil) {
      throw new NotFoundException('Perfil do usuario nao encontrado');
    }
    return perfil;
  }
}
