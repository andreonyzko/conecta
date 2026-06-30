import { AppDataBase } from '../db';
import { Usuario } from '../models/usuario';

export const UsuarioRepository = AppDataBase.getRepository(Usuario).extend({
  findByEmail(email: string) {
    return this.findOne({ where: { email } });
  },

  /** Busca incluindo a senha (que tem select:false), para validar login. */
  findByEmailWithSenha(email: string) {
    return this.createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .where('usuario.email = :email', { email })
      .getOne();
  },
});
