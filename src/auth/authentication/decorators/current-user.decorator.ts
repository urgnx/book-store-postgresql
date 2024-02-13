import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';

export interface AuthUser extends User {
  id: number;
}

export interface ICurrentUserAuth {
  user: AuthUser;
  accessToken: string;
}

export function getCurrentUserFromContext(
  data: keyof User | 'accessToken' | 'auth' | undefined,
  ctx: ExecutionContext,
):
  | ICurrentUserAuth
  | ICurrentUserAuth['user']
  | ICurrentUserAuth['accessToken'] {
  const request = ctx.switchToHttp().getRequest();
  const auth: ICurrentUserAuth = request.user;

  if (!auth) {
    throw new Error("Auth property isn't set on request object");
  }

  if (data === 'auth') return auth;

  const user = auth.user;

  if (!data) return user;
  if (['accessToken'].includes(data)) {
    return auth[data];
  }
  return user[data];
}

export const CurrentUser = createParamDecorator(getCurrentUserFromContext);
