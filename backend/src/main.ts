import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app.module';
import { AppDataBase } from './db';

async function bootstrap() {
  // Conecta no banco ANTES de subir o Nest (DataSource global, estilo TypeORM puro).
  await AppDataBase.initialize();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('AgroConecta API')
    .setDescription('API REST do AgroConecta - chamadas publicas da agricultura familiar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 3333;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  const driver = process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite (local)';
  logger.log(`Banco: ${driver}`);
  logger.log(`API em http://localhost:${port}/api`);
  logger.log(`Swagger em http://localhost:${port}/api/docs`);
}

bootstrap();
