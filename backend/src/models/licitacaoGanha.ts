import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Agricultor } from './agricultor';

@Entity('licitacoes_ganhas')
export class LicitacaoGanha {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  agricultorId!: string;

  @ManyToOne(() => Agricultor, (agricultor) => agricultor.licitacoesGanhas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agricultorId' })
  agricultor!: Agricultor;

  @Column({ type: 'uuid' })
  chamadaId!: string;

  @Column({ type: 'uuid' })
  instituicaoId!: string;

  @Column({ type: 'float', default: 0 })
  valor!: number;

  @Column()
  dataConclusao!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
