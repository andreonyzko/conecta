import { Module } from '@nestjs/common';
import { PropostaController } from '../controllers/PropostaController';
import { PropostaService } from '../services/PropostaService';

@Module({
  controllers: [PropostaController],
  providers: [PropostaService],
})
export class PropostaModule {}
