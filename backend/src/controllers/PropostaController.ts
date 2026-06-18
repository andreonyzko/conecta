import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

import { PropostaService } from '../services/PropostaService';
import { CreatePropostaDto } from '../dto/proposta/create-proposta.dto';
import { Roles } from '../middlewares/roles.decorator';

@ApiTags('Propostas')
@ApiBearerAuth()
@Controller('propostas')
export class PropostaController {
  constructor(private readonly propostaService: PropostaService) {}

  @Get()
  @ApiOperation({ summary: 'Lista propostas (filtre por chamadaId ou agricultorId)' })
  @ApiQuery({ name: 'chamadaId', required: false })
  @ApiQuery({ name: 'agricultorId', required: false })
  listar(
    @Query('chamadaId') chamadaId?: string,
    @Query('agricultorId') agricultorId?: string,
  ) {
    return this.propostaService.listar({ chamadaId, agricultorId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha uma proposta' })
  findById(@Param('id') id: string) {
    return this.propostaService.findById(id);
  }

  @Post()
  @Roles('agricultor')
  @ApiOperation({ summary: 'Envia uma proposta para uma chamada (agricultor)' })
  create(@Body() dto: CreatePropostaDto, @Req() req: Request) {
    return this.propostaService.create(dto, req.user!);
  }

  @Put(':id/aceitar')
  @Roles('instituicao')
  @ApiOperation({ summary: 'Aceita a proposta (instituicao dona da chamada)' })
  aceitar(@Param('id') id: string, @Req() req: Request) {
    return this.propostaService.aceitar(id, req.user!);
  }

  @Put(':id/rejeitar')
  @Roles('instituicao')
  @ApiOperation({ summary: 'Rejeita a proposta (instituicao dona da chamada)' })
  rejeitar(@Param('id') id: string, @Req() req: Request) {
    return this.propostaService.rejeitar(id, req.user!);
  }

  @Delete(':id')
  @Roles('agricultor')
  @ApiOperation({ summary: 'Cancela (remove) a propria proposta (agricultor)' })
  cancelar(@Param('id') id: string, @Req() req: Request) {
    return this.propostaService.cancelar(id, req.user!);
  }
}
