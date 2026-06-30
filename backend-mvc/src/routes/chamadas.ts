import { Router } from 'express';
import { chamadaController } from '../controllers/chamadaController';
import { requireAuth, requireRole } from '../middleware/auth';
export const chamadasRouter = Router();

chamadasRouter.get('/', chamadaController.index);
chamadasRouter.get('/new', requireAuth, requireRole('instituicao'), chamadaController.getNew);
chamadasRouter.post('/', requireAuth, requireRole('instituicao'), chamadaController.postCreate);
chamadasRouter.get('/:id', chamadaController.show);
chamadasRouter.get('/:id/edit', requireAuth, requireRole('instituicao'), chamadaController.getEdit);
chamadasRouter.put('/:id', requireAuth, requireRole('instituicao'), chamadaController.putUpdate);
chamadasRouter.post('/:id/cancelar', requireAuth, requireRole('instituicao'), chamadaController.postCancelar);
chamadasRouter.get('/:id/encerrar', requireAuth, requireRole('instituicao'), chamadaController.getEncerrar);
chamadasRouter.post('/:id/encerrar', requireAuth, requireRole('instituicao'), chamadaController.postEncerrar);
