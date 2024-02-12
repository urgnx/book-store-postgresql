import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserInputDto, UserResponseDto } from './dto';
import { RegisterUserInputDto } from '../auth/dto';

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

  async create(
    registerUserDto: RegisterUserInputDto,
  ): Promise<UserResponseDto> {
    const { firstName, lastName, email, password } = registerUserDto;

    const existingUser = await this.usersRepository.findOneBy({ email });

    if (existingUser) {
      throw new UnauthorizedException('Email is already taken');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return new UserResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();

    return users.map((user) => {
      return new UserResponseDto(user);
    });
  }

  async findOne(args: FindOneArgs): Promise<User | null> {
    return this.usersRepository.findOneBy({ ...args });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserInputDto,
  ) /*: Promise<User>*/ {
    //TODO: Add promise
    /* await this.usersRepository.update(id);*/
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
