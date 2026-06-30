import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    req.session.flash = { error: 'Faça login para continuar.' };
    return res.redirect('/login');
  }
  next();
}

export function requireRole(role: 'agricultor' | 'instituicao') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    if (req.session.user.role !== role) {
      return res.status(403).render('erro', {
        user: req.session.user,
        mensagem: 'Acesso negado para este perfil.',
      });
    }
    next();
  };
}
