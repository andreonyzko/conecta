import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Produto } from './produto';
import { Avaliacao } from './avaliacao';
import { LicitacaoGanha } from './licitacaoGanha';
import { Proposta } from './proposta';

@Entity('agricultores')
export class Agricultor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column({ default: '' })
  caf!: string;

  @Column()
  telefone!: string;

  @Column()
  email!: string;

  @Column({ default: false })
  realizaEntrega!: boolean;

  @OneToMany(() => Produto, (produto) => produto.agricultor, { cascade: true })
  produtos!: Produto[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.agricultor)
  avaliacoes!: Avaliacao[];

  @OneToMany(() => LicitacaoGanha, (licitacao) => licitacao.agricultor)
  licitacoesGanhas!: LicitacaoGanha[];

  @OneToMany(() => Proposta, (proposta) => proposta.agricultor)
  propostas!: Proposta[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
