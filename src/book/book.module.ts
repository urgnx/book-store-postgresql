import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), forwardRef(() => StoreModule)],
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
