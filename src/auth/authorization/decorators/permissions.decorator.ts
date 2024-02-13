import { applyDecorators, SetMetadata } from '@nestjs/common';
import {AbilityFactoryInterface} from "../types";

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = <
  EntityTargetType extends Record<string, any> = Record<string, any>,
>(
  abilityFactory: AbilityFactoryInterface<EntityTargetType>,
) => {
  return applyDecorators(SetMetadata(PERMISSIONS_KEY, abilityFactory));
};
