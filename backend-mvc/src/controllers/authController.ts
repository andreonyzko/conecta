import { Request, Response } from 'express';
import { authService } from '../services/AuthService';

export const authController = {
  getLogin(req: Request, res: Response) {
    if (req.session.user) return res.redirect('/chamadas');
    const flash = req.session.flash ?? {};
    req.session.flash = undefined;
    res.render('auth/login', { user: null, flash });
  },

  async postLogin(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      const user = await authService.login(email, senha);
      req.session.user = user;
      req.session.flash = { success: `Bem-vindo, ${user.nome}!` };
      res.redirect('/chamadas');
    } catch (e: any) {
      req.session.flash = { error: e.message };
      res.redirect('/login');
    }
  },

  getRegister(req: Request, res: Response) {
    if (req.session.user) return res.redirect('/chamadas');
    const flash = req.session.flash ?? {};
    req.session.flash = undefined;
    res.render('auth/register', { user: null, flash });
  },

  async postRegister(req: Request, res: Response) {
    try {
      const { role, nome, email, senha, telefone, cpfCnpj, caf, numeroAlunos } = req.body;
      const user = await authService.register({
        role, nome, email, senha, telefone, cpfCnpj,
        caf: caf || undefined,
        numeroAlunos: numeroAlunos ? Number(numeroAlunos) : undefined,
      });
      req.session.user = user;
      req.session.flash = { success: `Cadastro realizado! Bem-vindo, ${user.nome}.` };
      res.redirect('/chamadas');
    } catch (e: any) {
      req.session.flash = { error: e.message };
      res.redirect('/register');
    }
  },

  postLogout(req: Request, res: Response) {
    req.session.destroy(() => res.redirect('/login'));
  },
};
