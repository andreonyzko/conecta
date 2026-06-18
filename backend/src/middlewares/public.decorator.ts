import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marca uma rota como publica (ignora o AuthGuard global). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
