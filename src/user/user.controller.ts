import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInputDto, UpdateUserInputDto } from './dto';
import { Auth } from '../auth/decorators';
import { Roles } from '../auth/authorization/decorators';
import { Role } from '../auth/authorization/constants';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Roles(Role.ADMIN)
  @Get()
  async create(createUserInput: CreateUserInputDto) {
    return this.userService.create(createUserInput);
  }

  @Auth()
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Auth()
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne({ id }, true);
  }

  @Auth()
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserInputDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
