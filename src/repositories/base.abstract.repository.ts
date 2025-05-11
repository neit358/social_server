import { DeepPartial, FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { I_BaseInterfaceRepository } from './base.interface.repository';

interface HasId {
  id: string;
}

export default class BaseAbstractRepository<T extends ObjectLiteral & HasId>
  implements I_BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async findOneById(data: DeepPartial<T>): Promise<T | null> {
    const options: FindOptionsWhere<T> = {
      id: data.id,
    } as FindOptionsWhere<T>;
    return await this.entity.findOneBy(options);
  }

  public async findAll(options: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findByCondition(filterCondition: FindManyOptions<T>): Promise<T | null> {
    return await this.entity.findOne(filterCondition);
  }

  public createOne(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public async saveOne(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  public async update(id: string, data: DeepPartial<T>): Promise<void> {
    await this.entity.update(id, data);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }
}
