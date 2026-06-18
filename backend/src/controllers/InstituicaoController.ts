import { Controller, Get, Put, Param, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { InstituicaoService } from '../services/InstituicaoService';
import { UpdateInstituicaoDto } from '../dto/instituicao/update-instituicao.dto';
import { Roles } from '../middlewares/roles.decorator';

@ApiTags('Instituicoes')
@ApiBearerAuth()
@Controller('instituicoes')
export class InstituicaoController {
  constructor(private readonly instituicaoService: InstituicaoService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as instituicoes' })
  findAll() {
    return this.instituicaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha uma instituicao' })
  findById(@Param('id') id: string) {
    return this.instituicaoService.findById(id);
  }

  @Put(':id')
  @Roles('instituicao')
  @ApiOperation({ summary: 'Atualiza o proprio perfil de instituicao' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInstituicaoDto,
    @Req() req: Request,
  ) {
    return this.instituicaoService.update(id, dto, req.user!);
  }
}
