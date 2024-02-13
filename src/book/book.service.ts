import { Injectable, NotFoundException } from '@nestjs/common';
import { BookResponseDto, CreateBookInputDto, UpdateBookInputDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { StoreService } from '../store/store.service';
import { BooksQueryDto } from './dto/query/books.query.dto';

interface FindOneArgs {
  id?: number;
  author?: string;
}

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private readonly storeService: StoreService,
  ) {}

  async create(createBookInput: CreateBookInputDto) {
    const { name, author, publisher, quantity, storeId } = createBookInput;

    const store = await this.storeService.findOne({ id: storeId }, false);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const book = new Book();
    book.name = name;
    book.author = author;
    book.publisher = publisher;
    book.quantity = quantity;
    book.store = store;

    await this.bookRepository.save(book);

    return new BookResponseDto(book);
  }

  async findAll(query: BooksQueryDto) {
    const { storeId } = query;

    let filterQuery = this.bookRepository.createQueryBuilder('book');

    if (storeId) {
      filterQuery = filterQuery
        .leftJoinAndSelect('book.store', 'store')
        .where('store.id = :storeId', { storeId });
    }

    const books = await filterQuery.getMany();

    return books.map((book) => new BookResponseDto(book));
  }

  async findOne(args: FindOneArgs, throwException: boolean = false) {
    const book = await this.bookRepository.findOneBy({ ...args });

    if (!book && throwException) {
      throw new NotFoundException('Book not found');
    }

    return book ? new BookResponseDto(book) : null;
  }

  async update(id: number, updateBookInputDto: UpdateBookInputDto) {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    Object.assign(book, updateBookInputDto);

    const updatedBook = await this.bookRepository.save(book);

    return new BookResponseDto(updatedBook);
  }
}
