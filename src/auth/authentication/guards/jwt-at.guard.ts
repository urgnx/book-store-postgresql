import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(
      private readonly config: ConfigService,
      private reflector: Reflector,
  ) {
    const options = config.get('auth.options');

    super(options);
  }

  getRequest(context: ExecutionContext) {
    const requestType = context.getType();
    if (requestType === 'ws') {
      const client = context.switchToWs().getClient();
      return client.handshake;
    }

    return context.switchToHttp().getRequest();
  }

  canActivate(
      context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }
}
