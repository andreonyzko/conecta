import { Module } from '@nestjs/common';
import { AgricultorController } from '../controllers/AgricultorController';
import { AgricultorService } from '../services/AgricultorService';

@Module({
  controllers: [AgricultorController],
  providers: [AgricultorService],
})
export class AgricultorModule {}
