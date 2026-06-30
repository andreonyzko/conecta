import 'express-session';

export interface SessionUser {
  id: string;
  email: string;
  role: 'agricultor' | 'instituicao';
  perfilId: string;
  nome: string;
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
    flash?: { success?: string; error?: string };
  }
}
