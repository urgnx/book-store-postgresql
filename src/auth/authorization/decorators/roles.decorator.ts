import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Role } from '../constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  if (!Array.isArray(roles)) roles = [roles];
  return applyDecorators(SetMetadata(ROLES_KEY, roles));
};
