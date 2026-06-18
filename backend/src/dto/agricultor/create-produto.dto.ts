import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Alface Americana' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({ example: 'Hortalicas' })
  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  capacidadeMensal!: number;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty()
  unidade!: string;

  @ApiProperty({ example: ['Jan', 'Fev', 'Mar'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  mesesDisponiveis!: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  organico!: boolean;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  precoSugerido!: number;
}
