import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../models/usuario';

export class RegisterDto {
  @ApiProperty({ enum: ['agricultor', 'instituicao'], example: 'agricultor' })
  @IsEnum(['agricultor', 'instituicao'])
  role!: UserRole;

  @ApiProperty({ example: 'Joao da Silva Santos' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({ example: 'joao.santos@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  senha!: string;

  @ApiProperty({ example: '(63) 98765-4321' })
  @IsString()
  @IsNotEmpty()
  telefone!: string;

  @ApiProperty({ description: 'CPF (agricultor) ou CNPJ (instituicao)', example: '123.456.789-01' })
  @IsString()
  @IsNotEmpty()
  cpfCnpj!: string;

  @ApiPropertyOptional({ description: 'CAF do agricultor', example: 'CAF-TO-2024-001234' })
  @IsOptional()
  @IsString()
  caf?: string;

  @ApiPropertyOptional({ description: 'Numero de alunos da instituicao', example: 850 })
  @IsOptional()
  @IsInt()
  @Min(0)
  numeroAlunos?: number;
}
