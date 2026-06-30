import { Request, Response } from 'express';
import { chamadaService } from '../services/ChamadaService';
import { propostaService } from '../services/PropostaService';

function flash(req: Request, type: 'success' | 'error', msg: string) {
  req.session.flash = { [type]: msg };
}

export const chamadaController = {
  async index(req: Request, res: Response) {
    const chamadas = await chamadaService.findAll();
    const f = req.session.flash ?? {}; req.session.flash = undefined;
    res.render('chamadas/index', { user: req.session.user, chamadas, flash: f });
  },

  getNew(req: Request, res: Response) {
    const f = req.session.flash ?? {}; req.session.flash = undefined;
    res.render('chamadas/new', { user: req.session.user, flash: f });
  },

  async postCreate(req: Request, res: Response) {
    try {
      const { titulo, descricao, dataInicio, dataFim } = req.body;
      const produtos = [].concat(req.body['item_produto'] ?? []);
      const categorias = [].concat(req.body['item_categoria'] ?? []);
      const quantidades = [].concat(req.body['item_quantidade'] ?? []);
      const unidades = [].concat(req.body['item_unidade'] ?? []);
      const frequencias = [].concat(req.body['item_frequencia'] ?? []);
      const precos = [].concat(req.body['item_precoReferencia'] ?? []);

      const itens = produtos.map((_, i) => ({
        produto: produtos[i], categoria: categorias[i],
        quantidade: Number(quantidades[i]), unidade: unidades[i],
        frequencia: frequencias[i], precoReferencia: Number(precos[i]),
      }));

      const chamada = await chamadaService.create({ titulo, descricao, dataInicio, dataFim, itens }, req.session.user!);
      flash(req, 'success', 'Chamada criada com sucesso!');
      res.redirect(`/chamadas/${chamada.id}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas/new');
    }
  },

  async show(req: Request, res: Response) {
    try {
      const chamada = await chamadaService.findById(req.params.id);
      const itensStatus = await chamadaService.getItensComStatus(req.params.id);
      const totalmenteAtendida = await chamadaService.chamadaTotalmenteAtendida(req.params.id);

      let propostas: any[] = [];
      const user = req.session.user;
      if (user?.role === 'instituicao' && user.perfilId === chamada.instituicaoId) {
        propostas = await propostaService.listar({ chamadaId: chamada.id });
      }

      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('chamadas/show', {
        user, chamada, itensStatus, totalmenteAtendida, propostas, flash: f,
      });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas');
    }
  },

  async getEdit(req: Request, res: Response) {
    try {
      const chamada = await chamadaService.findById(req.params.id);
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('chamadas/edit', { user: req.session.user, chamada, flash: f });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect('/chamadas');
    }
  },

  async putUpdate(req: Request, res: Response) {
    try {
      const { titulo, descricao, dataInicio, dataFim } = req.body;
      await chamadaService.update(req.params.id, { titulo, descricao, dataInicio, dataFim }, req.session.user!);
      flash(req, 'success', 'Chamada atualizada!');
      res.redirect(`/chamadas/${req.params.id}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/chamadas/${req.params.id}/edit`);
    }
  },

  async postCancelar(req: Request, res: Response) {
    try {
      await chamadaService.cancelar(req.params.id, req.session.user!);
      flash(req, 'success', 'Chamada cancelada.');
      res.redirect(`/chamadas/${req.params.id}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/chamadas/${req.params.id}`);
    }
  },

  async getEncerrar(req: Request, res: Response) {
    try {
      const chamada = await chamadaService.findById(req.params.id);
      const propostas = await propostaService.listar({ chamadaId: chamada.id });
      const aceitas = propostas.filter(p => p.status === 'aceita');
      const agricultoresIds = [...new Set(aceitas.map(p => p.agricultorId))];
      const { AgricultorRepository } = await import('../repositories/AgricultorRepository');
      const agricultores = await Promise.all(agricultoresIds.map(id => AgricultorRepository.findOne({ where: { id: id as string } })));
      const f = req.session.flash ?? {}; req.session.flash = undefined;
      res.render('chamadas/encerrar', {
        user: req.session.user, chamada, agricultores: agricultores.filter(Boolean), flash: f,
      });
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/chamadas/${req.params.id}`);
    }
  },

  async postEncerrar(req: Request, res: Response) {
    try {
      const agricultoresIds = [].concat(req.body['agricultor_id'] ?? []);
      const notas = [].concat(req.body['nota'] ?? []);
      const comentarios = [].concat(req.body['comentario'] ?? []);

      const avaliacoes = agricultoresIds.map((id, i) => ({
        agricultorId: id as string,
        nota: Number(notas[i]),
        comentario: comentarios[i] as string,
      }));

      await chamadaService.encerrar(req.params.id, { avaliacoes }, req.session.user!);
      flash(req, 'success', 'Chamada encerrada com sucesso! Licitações e avaliações registradas.');
      res.redirect(`/chamadas/${req.params.id}`);
    } catch (e: any) {
      flash(req, 'error', e.message);
      res.redirect(`/chamadas/${req.params.id}/encerrar`);
    }
  },
};
