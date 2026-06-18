import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chamada } from './chamada';

@Entity('instituicoes')
export class Instituicao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column()
  cnpj!: string;

  @Column()
  telefone!: string;

  @Column()
  email!: string;

  @Column({ type: 'int', default: 0 })
  numeroAlunos!: number;

  @OneToMany(() => Chamada, (chamada) => chamada.instituicao)
  chamadas!: Chamada[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
