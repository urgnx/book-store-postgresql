import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { UserService } from '../../../user/user.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_AT_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request | Socket, payload: any) {
    let accessToken: string | undefined;
    if ((req as Socket).handshake) {
      accessToken = (req as any)?.handshake?.headers?.authorization
        ?.replace('Bearer', '')
        .trim();
    } else if (!(req as any).get && (req as any).headers) {
      accessToken = (req as any).headers.authorization
        ?.replace('Bearer', '')
        .trim();
    } else {
      accessToken = (req as Request)
        ?.get('authorization')
        ?.replace('Bearer', '')
        .trim();
    }

    if (!accessToken) throw new ForbiddenException('Access token malformed');

    const { sub } = payload;
    const user = await this.userService.findOne({ id: sub });

    if (!user) throw new ForbiddenException('Access token malformed');

    return {
      accessToken,
      user,
    };
  }
}
