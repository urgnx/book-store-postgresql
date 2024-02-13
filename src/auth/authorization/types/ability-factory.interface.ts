import { Request } from 'express';

import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User } from '../../../user/entities/user.entity';

type MethodKeysOf<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type CanFunction = () => void;

type CannotFunction = (exception?: string | HttpException | undefined) => void;

export type AbilityBuilder<Req extends Request = Request> = {
  can: CanFunction;
  cannot: CannotFunction;
  context: any;
  request: Req;
  user: User;
};

export type DefinePermissions<EntityTargetType> = (
  builder: AbilityBuilder,
) => void | Promise<void>;

export type AbilityFactoryInterface<
  Controller extends Record<string, any>,
  AllowPartial extends boolean = false,
  T = AllowPartial extends true ? Partial<Controller> : Controller,
> = Record<MethodKeysOf<T>, DefinePermissions<User>>;
