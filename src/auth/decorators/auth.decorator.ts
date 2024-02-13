import { UseGuards } from '@nestjs/common';
import { PermissionsGuard, RolesGuard } from '../authorization/guards';
import { AtGuard, LocalGuard } from '../authentication/guards';

type Gate = 'jwt' /*| 'jwt-refresh'*/ | 'local';

function authenticationGateSelector(gate?: Gate) {
  if (!gate) gate = 'jwt';
  const gates = {
    /*'jwt-refresh': RtGuard,*/
    local: LocalGuard,
    jwt: AtGuard,
  };
  const guard = gates[gate];

  return guard;
}

export function Auth(gate?: Gate) {
  const authenticationGuard = authenticationGateSelector(gate);

  return UseGuards(authenticationGuard, RolesGuard, PermissionsGuard);
}
