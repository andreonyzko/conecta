import { Router } from 'express';
import { propostaController } from '../controllers/propostaController';
import { requireAuth, requireRole } from '../middleware/auth';
export const propostasRouter = Router();

// Propostas vinculadas a uma chamada
propostasRouter.get('/chamadas/:callId/propostas/new', requireAuth, requireRole('agricultor'), propostaController.getNew);
propostasRouter.post('/chamadas/:callId/propostas', requireAuth, requireRole('agricultor'), propostaController.postCreate);

// Propostas independentes
propostasRouter.get('/propostas/minhas', requireAuth, requireRole('agricultor'), propostaController.minhas);
propostasRouter.get('/propostas/:id', requireAuth, propostaController.show);
propostasRouter.post('/propostas/:id/aceitar', requireAuth, requireRole('instituicao'), propostaController.postAceitar);
propostasRouter.post('/propostas/:id/rejeitar', requireAuth, requireRole('instituicao'), propostaController.postRejeitar);
propostasRouter.delete('/propostas/:id', requireAuth, requireRole('agricultor'), propostaController.deleteCancelar);
