import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AgricultorService } from '../services/AgricultorService';
import { UpdateAgricultorDto } from '../dto/agricultor/update-agricultor.dto';
import { CreateProdutoDto } from '../dto/agricultor/create-produto.dto';
import { UpdateProdutoDto } from '../dto/agricultor/update-produto.dto';
import { Roles } from '../middlewares/roles.decorator';

@ApiTags('Agricultores')
@ApiBearerAuth()
@Controller('agricultores')
export class AgricultorController {
  constructor(private readonly agricultorService: AgricultorService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os agricultores' })
  findAll() {
    return this.agricultorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha um agricultor (com produtos, avaliacoes e licitacoes)' })
  findById(@Param('id') id: string) {
    return this.agricultorService.findById(id);
  }

  @Put(':id')
  @Roles('agricultor')
  @ApiOperation({ summary: 'Atualiza o proprio perfil de agricultor' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAgricultorDto,
    @Req() req: Request,
  ) {
    return this.agricultorService.update(id, dto, req.user!);
  }

  @Get(':id/produtos')
  @ApiOperation({ summary: 'Lista os produtos de um agricultor' })
  listarProdutos(@Param('id') id: string) {
    return this.agricultorService.listarProdutos(id);
  }

  @Post(':id/produtos')
  @Roles('agricultor')
  @ApiOperation({ summary: 'Cadastra um produto para o agricultor' })
  addProduto(
    @Param('id') id: string,
    @Body() dto: CreateProdutoDto,
    @Req() req: Request,
  ) {
    return this.agricultorService.addProduto(id, dto, req.user!);
  }

  @Put(':id/produtos/:produtoId')
  @Roles('agricultor')
  @ApiOperation({ summary: 'Atualiza um produto do agricultor' })
  updateProduto(
    @Param('id') id: string,
    @Param('produtoId') produtoId: string,
    @Body() dto: UpdateProdutoDto,
    @Req() req: Request,
  ) {
    return this.agricultorService.updateProduto(id, produtoId, dto, req.user!);
  }

  @Delete(':id/produtos/:produtoId')
  @Roles('agricultor')
  @ApiOperation({ summary: 'Remove um produto do agricultor' })
  removeProduto(
    @Param('id') id: string,
    @Param('produtoId') produtoId: string,
    @Req() req: Request,
  ) {
    return this.agricultorService.removeProduto(id, produtoId, req.user!);
  }

  @Get(':id/avaliacoes')
  @ApiOperation({ summary: 'Lista as avaliacoes recebidas pelo agricultor' })
  listarAvaliacoes(@Param('id') id: string) {
    return this.agricultorService.listarAvaliacoes(id);
  }
}
