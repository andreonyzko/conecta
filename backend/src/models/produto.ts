import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agricultor } from './agricultor';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  agricultorId!: string;

  @ManyToOne(() => Agricultor, (agricultor) => agricultor.produtos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agricultorId' })
  agricultor!: Agricultor;

  @Column()
  nome!: string;

  @Column()
  categoria!: string;

  @Column({ type: 'int', default: 0 })
  capacidadeMensal!: number;

  @Column()
  unidade!: string;

  @Column({ type: 'simple-json' })
  mesesDisponiveis!: string[];

  @Column({ default: false })
  organico!: boolean;

  @Column({ type: 'float', default: 0 })
  precoSugerido!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
