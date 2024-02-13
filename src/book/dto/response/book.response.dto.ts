import _ from 'lodash';
import { Book } from '../../entities/book.entity';
import { StoreResponseDto } from '../../../store/dto';

const properties = [
  'id',
  'name',
  'author',
  'publisher',
  'quantity',
  'store',
  'createdAt',
  'updatedAt',
];

export class BookResponseDto {
  id!: number;

  name!: string;

  author!: string;

  publisher!: string;

  quantity!: number;

  store?: StoreResponseDto;

  createdAt!: Date;

  updatedAt!: Date;

  constructor(input: Book) {
    const partial = _.pick(input, properties);
    const source = (partial as any).toJSON?.() ?? partial;

    if (source.store) {
      source.store = new StoreResponseDto(source.store);
    }

    Object.assign(this, source);
  }
}
