import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';

import { AuthModule } from './auth.module';
import { AgricultorModule } from './agricultor.module';
import { InstituicaoModule } from './instituicao.module';
import { ChamadaModule } from './chamada.module';
import { PropostaModule } from './proposta.module';

import { AuthGuard } from '../middlewares/auth.guard';
import { RolesGuard } from '../middlewares/roles.guard';
import { HttpExceptionFilter } from '../middlewares/http-exception.filter';

@Module({
  imports: [
    AuthModule,
    AgricultorModule,
    InstituicaoModule,
    ChamadaModule,
    PropostaModule,
  ],
  providers: [
    // AuthGuard roda antes do RolesGuard (ordem importa).
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
