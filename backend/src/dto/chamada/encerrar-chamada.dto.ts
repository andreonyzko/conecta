import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class AvaliacaoEncerramentoDto {
  @ApiProperty({ example: 'uuid-do-agricultor' })
  @IsString()
  @IsNotEmpty()
  agricultorId!: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  nota!: number;

  @ApiPropertyOptional({ example: 'Entrega no prazo e produtos de otima qualidade.' })
  @IsOptional()
  @IsString()
  comentario?: string;
}

export class EncerrarChamadaDto {
  @ApiPropertyOptional({ type: [AvaliacaoEncerramentoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvaliacaoEncerramentoDto)
  avaliacoes?: AvaliacaoEncerramentoDto[];
}
