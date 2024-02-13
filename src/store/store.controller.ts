import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreInputDto, UpdateStoreInputDto } from './dto';
import { Auth } from '../auth/decorators';
import { Roles } from '../auth/authorization/decorators';
import { Role } from '../auth/authorization/constants';

@Controller('api/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Auth()
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createStoreInput: CreateStoreInputDto) {
    return this.storeService.create(createStoreInput);
  }

  @Auth()
  @Roles(Role.USER)
  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Auth()
  @Roles(Role.USER)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.storeService.findOne({ id }, true);
  }

  @Auth()
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoreInput: UpdateStoreInputDto,
  ) {
    return this.storeService.update(+id, updateStoreInput);
  }

  @Auth()
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
