import _ from 'lodash';
import { Store } from '../../entities/store.entity';

const properties = ['id', 'name', 'createdAt', 'updatedAt'];

export class StoreResponseDto {
  id!: number;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;

  constructor(input: Store) {
    const partial = _.pick(input, properties);
    const source = (partial as any).toJSON?.() ?? partial;

    Object.assign(this, source);
  }
}
