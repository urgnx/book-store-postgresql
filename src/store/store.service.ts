import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateStoreInputDto,
  StoreResponseDto,
  UpdateStoreInputDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';

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

  update(id: number, updateStoreInputDto: UpdateStoreInputDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
