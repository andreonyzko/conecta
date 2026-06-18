import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

import { ChamadaService } from '../services/ChamadaService';
import { CreateChamadaDto } from '../dto/chamada/create-chamada.dto';
import { EncerrarChamadaDto } from '../dto/chamada/encerrar-chamada.dto';
import { Roles } from '../middlewares/roles.decorator';
import { Public } from '../middlewares/public.decorator';
import { ChamadaStatus } from '../models/chamada';

@ApiTags('Chamadas')
@Controller('chamadas')
export class ChamadaController {
  constructor(private readonly chamadaService: ChamadaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista chamadas (filtros opcionais por status e instituicao)' })
  @ApiQuery({ name: 'status', required: false, enum: ['ativa', 'encerrada', 'cancelada'] })
  @ApiQuery({ name: 'instituicaoId', required: false })
  findAll(
    @Query('status') status?: ChamadaStatus,
    @Query('instituicaoId') instituicaoId?: string,
  ) {
    return this.chamadaService.findAll({ status, instituicaoId });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Detalha uma chamada com seus itens' })
  findById(@Param('id') id: string) {
    return this.chamadaService.findById(id);
  }

  @Get(':id/itens-disponiveis')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Itens da chamada ainda nao aceitos em nenhuma proposta' })
  itensDisponiveis(@Param('id') id: string) {
    return this.chamadaService.getItensDisponiveis(id);
  }

  @Get(':id/propostas')
  @ApiBearerAuth()
  @Roles('instituicao')
  @ApiOperation({ summary: 'Lista as propostas recebidas pela chamada (instituicao dona)' })
  propostas(@Param('id') id: string, @Req() req: Request) {
    return this.chamadaService.getPropostas(id, req.user!);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('instituicao')
  @ApiOperation({ summary: 'Cria uma chamada publica' })
  create(@Body() dto: CreateChamadaDto, @Req() req: Request) {
    return this.chamadaService.create(dto, req.user!);
  }

  @Put(':id/cancelar')
  @ApiBearerAuth()
  @Roles('instituicao')
  @ApiOperation({ summary: 'Cancela a chamada (propostas viram chamada_cancelada)' })
  cancelar(@Param('id') id: string, @Req() req: Request) {
    return this.chamadaService.cancelar(id, req.user!);
  }

  @Put(':id/encerrar')
  @ApiBearerAuth()
  @Roles('instituicao')
  @ApiOperation({ summary: 'Encerra a chamada, gera licitacoes e registra avaliacoes' })
  encerrar(
    @Param('id') id: string,
    @Body() dto: EncerrarChamadaDto,
    @Req() req: Request,
  ) {
    return this.chamadaService.encerrar(id, dto, req.user!);
  }
}
