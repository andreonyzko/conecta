import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateItemChamadaDto {
  @ApiProperty({ example: 'Alface' })
  @IsString()
  @IsNotEmpty()
  produto!: string;

  @ApiProperty({ example: 'Hortalicas' })
  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(0)
  quantidade!: number;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty()
  unidade!: string;

  @ApiProperty({ example: 'Semanal' })
  @IsString()
  @IsNotEmpty()
  frequencia!: string;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  precoReferencia!: number;
}

export class CreateChamadaDto {
  @ApiProperty({ example: 'Chamada Publica no 01/2026 - Merenda Escolar' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({ example: 'Aquisicao de generos alimenticios da agricultura familiar...' })
  @IsString()
  descricao!: string;

  @ApiProperty({ example: '2026-04-15' })
  @IsString()
  @IsNotEmpty()
  dataInicio!: string;

  @ApiProperty({ example: '2026-04-30' })
  @IsString()
  @IsNotEmpty()
  dataFim!: string;

  @ApiProperty({ type: [CreateItemChamadaDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemChamadaDto)
  itens!: CreateItemChamadaDto[];
}
