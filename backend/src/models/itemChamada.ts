import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chamada } from './chamada';

@Entity('itens_chamada')
export class ItemChamada {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  chamadaId!: string;

  @ManyToOne(() => Chamada, (chamada) => chamada.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chamadaId' })
  chamada!: Chamada;

  @Column()
  produto!: string;

  @Column()
  categoria!: string;

  @Column({ type: 'float', default: 0 })
  quantidade!: number;

  @Column()
  unidade!: string;

  @Column()
  frequencia!: string;

  @Column({ type: 'float', default: 0 })
  precoReferencia!: number;
}
