import { IsEnum } from 'class-validator';
import { RegisterUserInputDto } from '../../../auth/authentication/dto';
import { Role } from '../../../auth/authorization/constants';

export class CreateUserInputDto extends RegisterUserInputDto {
  @IsEnum(Role)
  role!: Role;
}
