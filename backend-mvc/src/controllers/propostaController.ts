import { Request, Response } from 'express';
import { propostaService } from '../services/PropostaService';
import { chamadaService } from '../services/ChamadaService';

function flash(req: Request, type: 'success' | 'error', msg: string) {
  req.session.flash = { [type]: msg };
}

export const propostaController = {
  async getNew(req: Request, res: Response) {
    try {
      const chamada = await chamadaService.findById(req.params.callId);
      const itensDisponiveis = await chamadaService.getItensComStatus(req.params.callId);
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('propostas/new', {
        user: req.session.user, chamada,
        itensDisponiveis: itensDisponiveis.filter(i => !i.atendido), flash: f,
      });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/chamadas/${req.params.callId}`);
    }
  },

  async postCreate(req: Request, res: Response) {
    try {
      const { realizaEntrega, mensagem } = req.body;
      const produtos = [].concat(req.body['item_produto'] ?? []);
      const quantidades = [].concat(req.body['item_quantidade'] ?? []);
      const unidades = [].concat(req.body['item_unidade'] ?? []);
      const precos = [].concat(req.body['item_precoPorUnidade'] ?? []);

      const itens = produtos.map((_, i) => ({
        produto: produtos[i] as string,
        quantidade: Number(quantidades[i]),
        unidade: unidades[i] as string,
        precoPorUnidade: Number(precos[i]),
      }));

      await propostaService.create({
        chamadaId: req.params.callId, realizaEntrega: realizaEntrega === 'on',
        mensagem, itens,
      }, req.session.user!);

      flash(req, 'success', 'Proposta enviada com sucesso!');
      res.redirect(`/chamadas/${req.params.callId}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/chamadas/${req.params.callId}/propostas/new`);
    }
  },

  async show(req: Request, res: Response) {
    try {
      const proposta = await propostaService.findById(req.params.id);
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('propostas/show', { user: req.session.user, proposta, flash: f });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas');
    }
  },

  async minhas(req: Request, res: Response) {
    const propostas = await propostaService.listar({ agricultorId: req.session.user!.perfilId });
    const f = req.session.flash ?? {}; req.session.flash = undefined;
    res.render('propostas/index', { user: req.session.user, propostas, titulo: 'Minhas Propostas', flash: f });
  },

  async postAceitar(req: Request, res: Response) {
    try {
      const proposta = await propostaService.findById(req.params.id);
      await propostaService.aceitar(req.params.id, req.session.user!);
      flash(req, 'success', 'Proposta aceita!');
      res.redirect(`/chamadas/${proposta.chamadaId}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      const p = await propostaService.findById(req.params.id).catch(() => null);
      res.redirect(p ? `/chamadas/${p.chamadaId}` : '/chamadas');
    }
  },

  async postRejeitar(req: Request, res: Response) {
    try {
      const proposta = await propostaService.findById(req.params.id);
      await propostaService.rejeitar(req.params.id, req.session.user!);
      flash(req, 'success', 'Proposta rejeitada.');
      res.redirect(`/chamadas/${proposta.chamadaId}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas');
    }
  },

  async deleteCancelar(req: Request, res: Response) {
    try {
      await propostaService.cancelar(req.params.id, req.session.user!);
      flash(req, 'success', 'Proposta cancelada.');
      res.redirect('/propostas/minhas');
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas');
    }
  },
};
