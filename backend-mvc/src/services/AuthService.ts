import * as bcrypt from 'bcryptjs';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { AgricultorRepository } from '../repositories/AgricultorRepository';
import { InstituicaoRepository } from '../repositories/InstituicaoRepository';
import { SessionUser } from '../types/session';

const BCRYPT_ROUNDS = 10;

export interface RegisterInput {
  role: 'agricultor' | 'instituicao';
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpfCnpj: string;
  caf?: string;
  numeroAlunos?: number;
}

export class AuthService {
  async register(input: RegisterInput): Promise<SessionUser> {
    const existente = await UsuarioRepository.findByEmail(input.email);
    if (existente) throw new Error('Já existe um usuário com este e-mail.');

    let perfilId: string;
    let nome: string;

    if (input.role === 'agricultor') {
      const a = await AgricultorRepository.save(AgricultorRepository.create({
        nome: input.nome, cpf: input.cpfCnpj, caf: input.caf ?? '',
        telefone: input.telefone, email: input.email, realizaEntrega: false,
      }));
      perfilId = a.id;
      nome = a.nome;
    } else {
      const i = await InstituicaoRepository.save(InstituicaoRepository.create({
        nome: input.nome, cnpj: input.cpfCnpj, telefone: input.telefone,
        email: input.email, numeroAlunos: input.numeroAlunos ?? 0,
      }));
      perfilId = i.id;
      nome = i.nome;
    }

    const senhaHash = await bcrypt.hash(input.senha, BCRYPT_ROUNDS);
    const usuario = await UsuarioRepository.save(UsuarioRepository.create({
      email: input.email, senha: senhaHash, role: input.role,
      agricultorId: input.role === 'agricultor' ? perfilId : null,
      instituicaoId: input.role === 'instituicao' ? perfilId : null,
    }));

    return { id: usuario.id, email: usuario.email, role: input.role, perfilId, nome };
  }

  async login(email: string, senha: string): Promise<SessionUser> {
    const usuario = await UsuarioRepository.findByEmailWithSenha(email);
    if (!usuario) throw new Error('Credenciais inválidas.');

    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) throw new Error('Credenciais inválidas.');

    const perfilId = (usuario.agricultorId ?? usuario.instituicaoId) as string;
    let nome = email;

    if (usuario.role === 'agricultor') {
      const a = await AgricultorRepository.findOne({ where: { id: perfilId } });
      nome = a?.nome ?? email;
    } else {
      const i = await InstituicaoRepository.findOne({ where: { id: perfilId } });
      nome = i?.nome ?? email;
    }

    return { id: usuario.id, email: usuario.email, role: usuario.role, perfilId, nome };
  }
}

export const authService = new AuthService();
