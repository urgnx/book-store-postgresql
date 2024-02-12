import { User } from '../../entities/user.entity';
import _ from 'lodash';

const properties = [
  'id',
  'firstName',
  'lastName',
  'email',
  'createdAt',
  'updatedAt',
];

export class UserResponseDto {
  id!: number;

  firstName!: string;

  lastName?: string;

  email!: string;

  createdAt!: Date;

  updatedAt!: Date;

  constructor(input: User) {
    const partial = _.pick(input, properties);
    const source = (partial as any).toJSON?.() ?? partial;

    Object.assign(this, source);
  }
}
