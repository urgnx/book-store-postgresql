import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Public } from './decorators';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserInputDto, RegisterUserInputDto } from './dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserInput: RegisterUserInputDto) {
    return this.userService.create(registerUserInput);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginUserInput: LoginUserInputDto) {
    return this.authService.login(loginUserInput);
  }
}
