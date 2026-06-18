import { AppDataBase } from '../db';
import { Produto } from '../models/produto';

export const ProdutoRepository = AppDataBase.getRepository(Produto).extend({
  findByAgricultor(agricultorId: string) {
    return this.find({ where: { agricultorId }, order: { nome: 'ASC' } });
  },
});
