import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Request } from 'express';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { User } from '../../../user/entities/user.entity';
import {
  AbilityBuilder,
  AbilityFactoryInterface,
  CanFunction,
  DefinePermissions,
} from '../types';
import { PERMISSIONS_KEY } from '../decorators';
import { getCurrentUserFromContext } from '../../authentication/decorators';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private exception: InstanceType<typeof HttpException> | true | null = true;
  private abilityFactory: AbilityFactoryInterface<any> | null = null;

  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();

    this.initializeAbilityFactory(context);

    const abilityFactory = this.abilityFactory;

    if (!abilityFactory) {
      return true;
    }

    const ability: DefinePermissions<User> =
      abilityFactory[handler.name]?.bind(abilityFactory);

    if (!ability) {
      return true;
    }

    const payload = this.prepareAbilityPayload(context);
    await ability(payload);

    if (!!this.exception && this.exception !== true) {
      throw this.exception;
    }

    return !this.exception;
  }

  private initializeAbilityFactory(context: ExecutionContext) {
    const controller = context.getClass();
    const handler = context.getHandler();

    const abilityFactoryClass = this.reflector.getAllAndOverride<
      Constructor<AbilityFactoryInterface<any>>
    >(PERMISSIONS_KEY, [handler, controller]);

    if (!abilityFactoryClass) {
      return;
    }

    const abilityFactory =
      this.moduleRef.get<AbilityFactoryInterface<any>>(abilityFactoryClass);

    this.abilityFactory =
      abilityFactory as unknown as AbilityFactoryInterface<any>;
  }

  private prepareAbilityPayload(context: ExecutionContext): AbilityBuilder {
    const request: Request = context.switchToHttp().getRequest();
    const user = getCurrentUserFromContext(undefined, context) as User;

    const can: CanFunction = () => {
      this.exception = null;
    };

    type CannotFunction = (
      exception?: string | HttpException | undefined,
    ) => void;

    const cannot: CannotFunction = (
      exception?: string | HttpException | undefined,
    ) => {
      if (exception) {
        if (typeof exception === 'string') {
          throw new UnauthorizedException(exception);
        } else {
          throw exception;
        }
      } else {
        throw true;
      }
    };

    return {
      context,
      request,
      user,
      can,
      cannot,
    };
  }
}
