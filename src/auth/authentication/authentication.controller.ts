import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  LoginResponse,
  LoginUserInputDto,
  RegisterUserInputDto,
  SignupResponse,
} from './dto';
import { UserService } from '../../user/user.service';
import { CurrentUser, ICurrentUserAuth } from './decorators';
import { UserResponseDto } from '../../user/dto';
import { ConfigService } from '@nestjs/config';
import { Auth } from '../decorators';

@Controller('api/auth')
export class AuthenticationController {
  constructor(
    private readonly config: ConfigService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerUserInput: RegisterUserInputDto) {
    const user = await this.authenticationService.register(registerUserInput);

    const accessToken = await this.authenticationService.generateAccessToken(
      user,
      this.config.get('auth.atExpiresIn') as number,
    );

    const payload = new SignupResponse();
    payload.user = new UserResponseDto(user);
    payload.accessToken = accessToken;

    return payload;
  }

  @Post('login')
  async login(@Body() loginUserInput: LoginUserInputDto) {
    const user = await this.authenticationService.login(loginUserInput);

    const accessToken = await this.authenticationService.generateAccessToken(
      user,
      this.config.get('auth.atExpiresIn') as number,
    );

    const payload = new LoginResponse();
    payload.user = new UserResponseDto(user);
    payload.accessToken = accessToken;

    return payload;
  }

  @Get('me')
  @Auth()
  async me(@CurrentUser() user: ICurrentUserAuth['user']) {
    return new UserResponseDto(user);
  }
}
