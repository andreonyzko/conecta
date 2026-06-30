import { Request, Response } from 'express';
import { agricultorService } from '../services/AgricultorService';

function flash(req: Request, type: 'success' | 'error', msg: string) {
  req.session.flash = { [type]: msg };
}

export const agricultorController = {
  async show(req: Request, res: Response) {
    try {
      const agricultor = await agricultorService.findById(req.params.id);
      const avaliacoes = await agricultorService.listarAvaliacoes(req.params.id);
      const avaliacaoMedia = avaliacoes.length > 0
        ? avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length : 0;
      const { LicitacaoGanhaRepository } = await import('../repositories/LicitacaoGanhaRepository');
      const { ChamadaRepository } = await import('../repositories/ChamadaRepository');
      const lics = await LicitacaoGanhaRepository.findByAgricultor(req.params.id);
      const licitacoesGanhas = await Promise.all(lics.map(async l => ({
        ...l,
        chamada: await ChamadaRepository.findByIdComItens(l.chamadaId),
      })));
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('agricultor/show', {
        user: req.session.user, agricultor, avaliacoes, avaliacaoMedia, licitacoesGanhas, flash: f,
      });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas');
    }
  },

  async getEdit(req: Request, res: Response) {
    try {
      const agricultor = await agricultorService.findById(req.params.id);
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('agricultor/edit', { user: req.session.user, agricultor, flash: f });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/agricultor/${req.params.id}`);
    }
  },

  async putUpdate(req: Request, res: Response) {
    try {
      const { nome, telefone, email, caf, realizaEntrega } = req.body;
      await agricultorService.update(req.params.id, {
        nome, telefone, email, caf, realizaEntrega: realizaEntrega === 'on',
      }, req.session.user!);
      flash(req, 'success', 'Perfil atualizado!');
      res.redirect(`/agricultor/${req.params.id}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/agricultor/${req.params.id}/edit`);
    }
  },

  async postAddProduto(req: Request, res: Response) {
    try {
      const { nome, categoria, capacidadeMensal, unidade, organico, precoSugerido } = req.body;
      const mesesDisponiveis = [].concat(req.body['mesesDisponiveis'] ?? []);
      await agricultorService.addProduto(req.params.id, {
        nome, categoria, capacidadeMensal: Number(capacidadeMensal),
        unidade, organico: organico === 'on', precoSugerido: Number(precoSugerido),
        mesesDisponiveis,
      }, req.session.user!);
      flash(req, 'success', 'Produto adicionado!');
      res.redirect(`/agricultor/${req.params.id}/edit`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/agricultor/${req.params.id}/edit`);
    }
  },

  async deleteRemoveProduto(req: Request, res: Response) {
    try {
      await agricultorService.removeProduto(req.params.id, req.params.produtoId, req.session.user!);
      flash(req, 'success', 'Produto removido.');
      res.redirect(`/agricultor/${req.params.id}/edit`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/agricultor/${req.params.id}/edit`);
    }
  },
};
