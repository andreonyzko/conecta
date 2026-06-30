import { Request, Response } from 'express';
import { instituicaoService } from '../services/InstituicaoService';

function flash(req: Request, type: 'success' | 'error', msg: string) {
  req.session.flash = { [type]: msg };
}

export const instituicaoController = {
  async show(req: Request, res: Response) {
    try {
      const instituicao = await instituicaoService.findById(req.params.id);
      const { ChamadaRepository } = await import('../repositories/ChamadaRepository');
      const minhasChamadas = await ChamadaRepository.findAllComItens({ instituicaoId: req.params.id });
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('instituicao/show', { user: req.session.user, instituicao, chamadas: minhasChamadas, flash: f });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas');
    }
  },

  async getEdit(req: Request, res: Response) {
    try {
      const instituicao = await instituicaoService.findById(req.params.id);
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('instituicao/edit', { user: req.session.user, instituicao, flash: f });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/instituicao/${req.params.id}`);
    }
  },

  async putUpdate(req: Request, res: Response) {
    try {
      const { nome, telefone, email, numeroAlunos } = req.body;
      await instituicaoService.update(req.params.id, {
        nome, telefone, email, numeroAlunos: Number(numeroAlunos),
      }, req.session.user!);
      flash(req, 'success', 'Perfil atualizado!');
      res.redirect(`/instituicao/${req.params.id}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/instituicao/${req.params.id}/edit`);
    }
  },
};
