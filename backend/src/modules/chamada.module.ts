import { Module } from '@nestjs/common';
import { ChamadaController } from '../controllers/ChamadaController';
import { ChamadaService } from '../services/ChamadaService';

@Module({
  controllers: [ChamadaController],
  providers: [ChamadaService],
})
export class ChamadaModule {}
