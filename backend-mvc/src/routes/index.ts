import { Router, Request, Response } from 'express';
export const indexRouter = Router();

indexRouter.get('/', (req: Request, res: Response) => {
  if (req.session.user) return res.redirect('/chamadas');
  res.redirect('/login');
});

indexRouter.get('/meu-perfil', (req: Request, res: Response) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');
  if (user.role === 'agricultor') return res.redirect(`/agricultor/${user.perfilId}`);
  return res.redirect(`/instituicao/${user.perfilId}`);
});
