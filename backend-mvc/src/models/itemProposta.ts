import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proposta } from './proposta';

@Entity('itens_proposta')
export class ItemProposta {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  propostaId!: string;

  @ManyToOne(() => Proposta, (proposta) => proposta.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propostaId' })
  proposta!: Proposta;

  @Column()
  produto!: string;

  @Column({ type: 'float', default: 0 })
  quantidade!: number;

  @Column()
  unidade!: string;

  @Column({ type: 'float', default: 0 })
  precoPorUnidade!: number;

  @Column({ type: 'float', default: 0 })
  total!: number;
}
