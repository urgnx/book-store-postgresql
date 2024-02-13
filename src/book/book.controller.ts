import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookInputDto, UpdateBookInputDto } from './dto';
import { BooksQueryDto } from './dto/query/books.query.dto';
import { Auth } from '../auth/decorators';
import { Roles } from '../auth/authorization/decorators';
import { Role } from '../auth/authorization/constants';

@Controller('api/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Auth()
  @Roles(Role.STORE_MANAGER,Role.ADMIN)
  @Post()
  create(@Body() createBookInput: CreateBookInputDto) {
    return this.bookService.create(createBookInput);
  }

  @Auth()
  @Roles(Role.USER)
  @Get()
  async findAll(@Query() query: BooksQueryDto) {
    return this.bookService.findAll(query);
  }

  @Auth()
  @Roles(Role.USER)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookService.findOne({ id }, true);
  }

  @Auth()
  @Roles(Role.STORE_MANAGER, Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookInput: UpdateBookInputDto) {
    return this.bookService.update(+id, updateBookInput);
  }

  @Auth()
  @Roles(Role.STORE_MANAGER, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
