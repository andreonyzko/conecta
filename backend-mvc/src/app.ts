import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import * as path from 'path';
import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';

import { AppDataBase } from './db';
import { indexRouter } from './routes/index';
import { authRouter } from './routes/auth';
import { chamadasRouter } from './routes/chamadas';
import { propostasRouter } from './routes/propostas';
import { perfisRouter } from './routes/perfis';
import './types/session';

async function bootstrap() {
  await AppDataBase.initialize();
  console.log(`Banco: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite (local)'}`);

  const app = express();

  // Views
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Body parsing
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // PUT/DELETE via _method nos formulários
  app.use(methodOverride('_method'));

  // Sessão
  app.use(session({
    secret: process.env.SESSION_SECRET || 'agroconecta-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 horas
  }));

  // Rotas
  app.use('/', indexRouter);
  app.use('/', authRouter);
  app.use('/chamadas', chamadasRouter);
  app.use('/', propostasRouter);
  app.use('/', perfisRouter);

  // 404
  app.use((req, res) => {
    res.status(404).render('erro', { user: (req.session as any).user ?? null, mensagem: 'Página não encontrada.' });
  });

  const port = Number(process.env.PORT) || 3334;
  app.listen(port, () => {
    console.log(`AgroConecta MVC em http://localhost:${port}`);
  });
}

bootstrap().catch(console.error);
