import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInputDto, RegisterUserInputDto } from './dto';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/entities/user.entity';
import { Role } from '../authorization/constants';
import * as argon2 from '@node-rs/argon2';
import { AuthenticationErrorsEnum } from './constants';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserInput: RegisterUserInputDto): Promise<User> {
    const role = Role.USER;
    return this.userService.create({ ...registerUserInput, role });
  }

  async login(loginUserInput: LoginUserInputDto) {
    const user = await this.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );
    if (!user) {
      throw new UnauthorizedException(
        AuthenticationErrorsEnum.INVALID_CREDENTIALS,
      );
    }

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({
      email,
    });

    if (user) {
      const { password: userPassword } = user;
      const isPasswordValid = await argon2.verify(userPassword, password);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  async generateAccessToken(user: User, expiresIn: number) {
    const sub = user.id;
    const payload = { sub };
    return await this.jwtService.signAsync(payload, {
      expiresIn,
      secret: this.config.get('auth.atKey'),
    });
  }
}
