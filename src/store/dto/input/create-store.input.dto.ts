import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreInputDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
