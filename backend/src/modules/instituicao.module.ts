import { Module } from '@nestjs/common';
import { InstituicaoController } from '../controllers/InstituicaoController';
import { InstituicaoService } from '../services/InstituicaoService';

@Module({
  controllers: [InstituicaoController],
  providers: [InstituicaoService],
})
export class InstituicaoModule {}
