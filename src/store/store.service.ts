import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {
  CreateStoreInputDto,
  StoreResponseDto,
  UpdateStoreInputDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import {UpdateUserInputDto, UserResponseDto} from "../user/dto";
import {AuthenticationErrorsEnum} from "../auth/authentication/constants";

interface FindOneArgs {
  id?: number;
  name?: string;
}

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createStoreInput: CreateStoreInputDto) {
    const { name } = createStoreInput;

    const store = new Store();
    store.name = name;

    await this.storeRepository.save(store);

    return new StoreResponseDto(store);
  }

  async findAll(): Promise<StoreResponseDto[]> {
    const stores = await this.storeRepository.find();

    return stores.map((store) => new StoreResponseDto(store));
  }

  async findOne(args: FindOneArgs, throwException: boolean = false) {
    const store = await this.storeRepository.findOneBy({ ...args });

    if (!store && throwException) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(id: number, updateStoreInput: UpdateStoreInputDto) {
    const store = await this.storeRepository.findOneBy({ id });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    Object.assign(store, updateStoreInput);

    const updatedStore = await this.storeRepository.save(store);

    return new StoreResponseDto(updatedStore);
  }
}
