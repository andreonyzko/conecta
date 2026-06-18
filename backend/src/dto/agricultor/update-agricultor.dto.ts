import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateAgricultorDto {
  @ApiPropertyOptional({ example: 'Joao da Silva Santos' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 'CAF-TO-2024-001234' })
  @IsOptional()
  @IsString()
  caf?: string;

  @ApiPropertyOptional({ example: '(63) 98765-4321' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ example: 'joao.santos@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  realizaEntrega?: boolean;
}
