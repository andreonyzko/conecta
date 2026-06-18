import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Instituicao } from './instituicao';
import { ItemChamada } from './itemChamada';
import { Proposta } from './proposta';

export type ChamadaStatus = 'ativa' | 'encerrada' | 'cancelada';

@Entity('chamadas')
export class Chamada {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  titulo!: string;

  @Column({ type: 'uuid' })
  instituicaoId!: string;

  @ManyToOne(() => Instituicao, (instituicao) => instituicao.chamadas)
  @JoinColumn({ name: 'instituicaoId' })
  instituicao!: Instituicao;

  @Column({ type: 'text', default: '' })
  descricao!: string;

  @Column()
  dataInicio!: string;

  @Column()
  dataFim!: string;

  @Column({ default: 'ativa' })
  status!: ChamadaStatus;

  @OneToMany(() => ItemChamada, (item) => item.chamada, { cascade: true })
  itens!: ItemChamada[];

  @OneToMany(() => Proposta, (proposta) => proposta.chamada)
  propostas!: Proposta[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
