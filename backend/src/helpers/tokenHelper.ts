import * as jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { UserRole } from '../models/usuario';

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  // id do perfil (agricultor ou instituicao) associado ao usuario
  perfilId: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, authConfig.jwt.secret) as JWTPayload;
}
