import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInputDto, UpdateUserInputDto, UserResponseDto } from './dto';
import { AuthenticationErrorsEnum } from '../auth/authentication/constants';
import * as argon2 from '@node-rs/argon2';

interface FindOneArgs {
  id?: number;
  email?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInputDto) {
    const { firstName, lastName, email, password } = createUserInput;

    const emailExists = await this.usersRepository.findOneBy({ email });

    if (emailExists) {
      throw new ConflictException(
        AuthenticationErrorsEnum.EMAIL_ALREADY_EXISTS,
      );
    }

    const hashedPassword = await argon2.hash(createUserInput.password);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return user;
  }

  async findAll() /*: Promise<UserResponseDto[]> */ {
    const users = await this.usersRepository.find();

    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(args: FindOneArgs, throwException: boolean = false) {
    const user = await this.usersRepository.findOneBy({ ...args });

    if (!user && throwException) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserInputDto) {
    if (updateUserDto.email) {
      const emailExists = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (emailExists) {
        throw new ConflictException(
          AuthenticationErrorsEnum.EMAIL_ALREADY_EXISTS,
        );
      }
    }

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.usersRepository.save(user);

    return new UserResponseDto(updatedUser);
  }
}
