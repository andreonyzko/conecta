import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateInstituicaoDto {
  @ApiPropertyOptional({ example: 'Escola Municipal Joao Pessoa' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: '(63) 3212-4567' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ example: 'escola@edu.to.gov.br' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 850 })
  @IsOptional()
  @IsInt()
  @Min(0)
  numeroAlunos?: number;
}
