import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreInputDto } from './create-store.input.dto';

export class UpdateStoreInputDto extends PartialType(CreateStoreInputDto) {}
