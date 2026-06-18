/**
 * Popula o banco com dados de exemplo (instituicoes, agricultores, chamadas e propostas).
 * Uso: npm run seed
 * Senha de todos os usuarios de exemplo: senha123
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import * as bcrypt from 'bcryptjs';
import { AppDataBase } from '../db';
import { authConfig } from '../config/auth';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { AgricultorRepository } from '../repositories/AgricultorRepository';
import { InstituicaoRepository } from '../repositories/InstituicaoRepository';
import { ChamadaRepository } from '../repositories/ChamadaRepository';
import { PropostaRepository } from '../repositories/PropostaRepository';

const SENHA_PADRAO = 'senha123';

async function criarUsuario(
  email: string,
  role: 'agricultor' | 'instituicao',
  perfilId: string,
) {
  const senha = await bcrypt.hash(SENHA_PADRAO, authConfig.bcryptRounds);
  await UsuarioRepository.save(
    UsuarioRepository.create({
      email,
      senha,
      role,
      agricultorId: role === 'agricultor' ? perfilId : null,
      instituicaoId: role === 'instituicao' ? perfilId : null,
    }),
  );
}

async function seed() {
  await AppDataBase.initialize();

  const jaExiste = await UsuarioRepository.count();
  if (jaExiste > 0) {
    console.log('Banco ja possui dados. Seed ignorado.');
    await AppDataBase.destroy();
    return;
  }

  // ===== Instituicoes =====
  const escola = await InstituicaoRepository.save(
    InstituicaoRepository.create({
      nome: 'Escola Municipal Joao Pessoa',
      cnpj: '12.345.678/0001-90',
      telefone: '(63) 3212-4567',
      email: 'escola.joaopessoa@edu.to.gov.br',
      numeroAlunos: 850,
    }),
  );
  await criarUsuario(escola.email, 'instituicao', escola.id);

  const ifto = await InstituicaoRepository.save(
    InstituicaoRepository.create({
      nome: 'IFTO - Campus Palmas',
      cnpj: '98.765.432/0001-10',
      telefone: '(63) 3229-1234',
      email: 'campus.palmas@ifto.edu.br',
      numeroAlunos: 2400,
    }),
  );
  await criarUsuario(ifto.email, 'instituicao', ifto.id);

  // ===== Agricultores =====
  const joao = await AgricultorRepository.save(
    AgricultorRepository.create({
      nome: 'Joao da Silva Santos',
      cpf: '123.456.789-01',
      caf: 'CAF-TO-2024-001234',
      telefone: '(63) 98765-4321',
      email: 'joao.santos@email.com',
      realizaEntrega: true,
      produtos: [
        {
          nome: 'Alface Americana',
          categoria: 'Hortalicas',
          capacidadeMensal: 500,
          unidade: 'kg',
          mesesDisponiveis: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          organico: true,
          precoSugerido: 4.5,
        },
        {
          nome: 'Tomate Cereja',
          categoria: 'Hortalicas',
          capacidadeMensal: 300,
          unidade: 'kg',
          mesesDisponiveis: ['Jan', 'Fev', 'Mar', 'Nov', 'Dez'],
          organico: false,
          precoSugerido: 8.0,
        },
      ] as any,
    }),
  );
  await criarUsuario(joao.email, 'agricultor', joao.id);

  const maria = await AgricultorRepository.save(
    AgricultorRepository.create({
      nome: 'Maria Aparecida Pereira',
      cpf: '987.654.321-09',
      caf: 'CAF-TO-2024-005678',
      telefone: '(63) 91234-5678',
      email: 'maria.pereira@email.com',
      realizaEntrega: false,
      produtos: [
        {
          nome: 'Feijao Carioca',
          categoria: 'Leguminosas',
          capacidadeMensal: 800,
          unidade: 'kg',
          mesesDisponiveis: ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
          organico: false,
          precoSugerido: 7.0,
        },
      ] as any,
    }),
  );
  await criarUsuario(maria.email, 'agricultor', maria.id);

  // ===== Chamada =====
  const chamada = await ChamadaRepository.save(
    ChamadaRepository.create({
      titulo: 'Chamada Publica no 01/2026 - Merenda Escolar',
      instituicaoId: escola.id,
      descricao:
        'Chamada publica para aquisicao de generos alimenticios da agricultura familiar para a merenda escolar.',
      dataInicio: '2026-04-15',
      dataFim: '2026-04-30',
      status: 'ativa',
      itens: [
        { produto: 'Alface', categoria: 'Hortalicas', quantidade: 200, unidade: 'kg', frequencia: 'Semanal', precoReferencia: 4.5 },
        { produto: 'Feijao', categoria: 'Leguminosas', quantidade: 300, unidade: 'kg', frequencia: 'Mensal', precoReferencia: 7.5 },
      ] as any,
    }),
  );

  // ===== Proposta =====
  await PropostaRepository.save(
    PropostaRepository.create({
      chamadaId: chamada.id,
      agricultorId: joao.id,
      realizaEntrega: true,
      mensagem: 'Entrega garantida as tercas e quintas, sem custo adicional.',
      valorTotal: 200 * 4.2,
      status: 'pendente',
      dataCriacao: '2026-04-16',
      itens: [
        { produto: 'Alface', quantidade: 200, unidade: 'kg', precoPorUnidade: 4.2, total: 840 },
      ] as any,
    }),
  );

  console.log('Seed concluido com sucesso!');
  console.log('Usuarios de exemplo (senha: senha123):');
  console.log(`  Instituicao: ${escola.email}`);
  console.log(`  Agricultor:  ${joao.email}`);

  await AppDataBase.destroy();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
