import { CurrentUserInterface } from '../current-user.interface.dto';
import { UserResponseDto } from '../../../../user/dto';

export class SignupResponse implements CurrentUserInterface {
  user!: UserResponseDto;

  accessToken!: string;
}
