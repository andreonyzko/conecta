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
import { Chamada } from './chamada';
import { Agricultor } from './agricultor';
import { ItemProposta } from './itemProposta';

export type PropostaStatus = 'pendente' | 'aceita' | 'rejeitada' | 'chamada_cancelada';

@Entity('propostas')
export class Proposta {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  chamadaId!: string;

  @ManyToOne(() => Chamada, (chamada) => chamada.propostas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chamadaId' })
  chamada!: Chamada;

  @Column({ type: 'uuid' })
  agricultorId!: string;

  @ManyToOne(() => Agricultor, (agricultor) => agricultor.propostas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agricultorId' })
  agricultor!: Agricultor;

  @Column({ default: false })
  realizaEntrega!: boolean;

  @Column({ type: 'text', default: '' })
  mensagem!: string;

  @Column({ type: 'float', default: 0 })
  valorTotal!: number;

  @Column({ default: 'pendente' })
  status!: PropostaStatus;

  @Column()
  dataCriacao!: string;

  @OneToMany(() => ItemProposta, (item) => item.proposta, { cascade: true })
  itens!: ItemProposta[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
