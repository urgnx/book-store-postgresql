import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookInputDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  author!: string;

  @IsNotEmpty()
  @IsString()
  publisher!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  storeId!: number;
}
