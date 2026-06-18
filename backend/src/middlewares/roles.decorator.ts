import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../models/usuario';

export const ROLES_KEY = 'roles';

/** Restringe a rota aos perfis informados (ex.: @Roles('instituicao')). */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
