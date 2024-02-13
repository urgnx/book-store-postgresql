import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserInputDto } from './dto';
import { Auth } from '../auth/decorators';
import { Role } from '../auth/constants';
import { Roles } from '../auth/authorization/decorators';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Roles(Role.USER)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne({ id }, true);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserInputDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
