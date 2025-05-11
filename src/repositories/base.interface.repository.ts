import { DeepPartial, FindManyOptions } from 'typeorm';

export interface I_BaseInterfaceRepository<T> {
  findOneById(data: DeepPartial<T>): Promise<T | null>;
  findAll(options: FindManyOptions<T>): Promise<T[]>;
  findByCondition(filterCondition: FindManyOptions<T>): Promise<T | null>;
  createOne(data: DeepPartial<T>): T;
  saveOne(data: DeepPartial<T>): Promise<T>;
  createMany(data: DeepPartial<T>[]): T[];
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  update(id: string, data: DeepPartial<T>): Promise<void>;
  remove(data: T): Promise<T>;
}
