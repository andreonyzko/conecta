import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateItemPropostaDto {
  @ApiProperty({ example: 'Alface' })
  @IsString()
  @IsNotEmpty()
  produto!: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(0)
  quantidade!: number;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty()
  unidade!: string;

  @ApiProperty({ example: 4.2 })
  @IsNumber()
  @Min(0)
  precoPorUnidade!: number;
}

export class CreatePropostaDto {
  @ApiProperty({ example: 'uuid-da-chamada' })
  @IsString()
  @IsNotEmpty()
  chamadaId!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  realizaEntrega?: boolean;

  @ApiPropertyOptional({ example: 'Entrega garantida as tercas e quintas, sem custo.' })
  @IsOptional()
  @IsString()
  mensagem?: string;

  @ApiProperty({ type: [CreateItemPropostaDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemPropostaDto)
  itens!: CreateItemPropostaDto[];
}
