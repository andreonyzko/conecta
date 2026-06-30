import { Router } from 'express';
import { agricultorController } from '../controllers/agricultorController';
import { instituicaoController } from '../controllers/instituicaoController';
import { requireAuth, requireRole } from '../middleware/auth';
export const perfisRouter = Router();

// Agricultor
perfisRouter.get('/agricultor/:id', agricultorController.show);
perfisRouter.get('/agricultor/:id/edit', requireAuth, requireRole('agricultor'), agricultorController.getEdit);
perfisRouter.put('/agricultor/:id', requireAuth, requireRole('agricultor'), agricultorController.putUpdate);
perfisRouter.post('/agricultor/:id/produtos', requireAuth, requireRole('agricultor'), agricultorController.postAddProduto);
perfisRouter.delete('/agricultor/:id/produtos/:produtoId', requireAuth, requireRole('agricultor'), agricultorController.deleteRemoveProduto);

// Instituicao
perfisRouter.get('/instituicao/:id', instituicaoController.show);
perfisRouter.get('/instituicao/:id/edit', requireAuth, requireRole('instituicao'), instituicaoController.getEdit);
perfisRouter.put('/instituicao/:id', requireAuth, requireRole('instituicao'), instituicaoController.putUpdate);
