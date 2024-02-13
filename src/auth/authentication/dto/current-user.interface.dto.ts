import { UserResponseDto } from '../../../user/dto';

export abstract class CurrentUserInterface {
  user!: UserResponseDto;

  accessToken!: string;
}
