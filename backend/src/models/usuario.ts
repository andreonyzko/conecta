import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agricultor } from './agricultor';
import { Instituicao } from './instituicao';

export type UserRole = 'agricultor' | 'instituicao';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  senha!: string;

  @Column()
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'uuid', nullable: true })
  agricultorId?: string | null;

  @OneToOne(() => Agricultor, { nullable: true })
  @JoinColumn({ name: 'agricultorId' })
  agricultor?: Agricultor | null;

  @Column({ type: 'uuid', nullable: true })
  instituicaoId?: string | null;

  @OneToOne(() => Instituicao, { nullable: true })
  @JoinColumn({ name: 'instituicaoId' })
  instituicao?: Instituicao | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
