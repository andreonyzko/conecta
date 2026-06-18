import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { verifyToken } from '../helpers/tokenHelper';

/**
 * Guard global de autenticacao. Le o header Authorization: Bearer <token>,
 * valida o JWT e popula request.user. Rotas com @Public() sao liberadas.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token nao fornecido');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token invalido');
    }

    try {
      request.user = verifyToken(token);
      return true;
    } catch {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }
}
