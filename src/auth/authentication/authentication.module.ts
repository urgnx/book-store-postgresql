import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, LocalStrategy } from './strategies';
import { UserModule } from '../../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AtStrategy, LocalStrategy],
})
export class AuthenticationModule {}
