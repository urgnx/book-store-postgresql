import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class BooksQueryDto {
  @IsOptional()
  @Type(() => Number)
  storeId?: number;
}
