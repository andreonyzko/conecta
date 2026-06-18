import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Agricultor } from './agricultor';
import { Instituicao } from './instituicao';

@Entity('avaliacoes')
export class Avaliacao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  agricultorId!: string;

  @ManyToOne(() => Agricultor, (agricultor) => agricultor.avaliacoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agricultorId' })
  agricultor!: Agricultor;

  @Column({ type: 'uuid' })
  instituicaoId!: string;

  @ManyToOne(() => Instituicao)
  @JoinColumn({ name: 'instituicaoId' })
  instituicao!: Instituicao;

  @Column({ type: 'uuid', nullable: true })
  chamadaId?: string | null;

  @Column({ type: 'int' })
  nota!: number;

  @Column({ type: 'text', default: '' })
  comentario!: string;

  @Column()
  data!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
