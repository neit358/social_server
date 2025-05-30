import { DeepPartial, FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { I_BaseInterfaceRepository } from './base.interface.repository';
import { RedisService } from 'src/services/redis.service';
import { SearchService } from 'src/services/elasticsearch.service';

interface HasId {
  id: string;
}

export default class BaseAbstractRepository<T extends ObjectLiteral & HasId>
  implements I_BaseInterfaceRepository<T>
{
  protected readonly redisService: RedisService;
  protected readonly elasticsearchService: SearchService<T>;
  protected readonly entity: Repository<T>;

  constructor(entity: Repository<T>, redisService: RedisService, elasticsearch: SearchService<T>) {
    this.entity = entity;
    this.redisService = redisService;
    this.elasticsearchService = elasticsearch;
  }

  public async findOneById(data: DeepPartial<T>): Promise<T | null> {
    const options: FindOptionsWhere<T> = {
      id: data.id,
    } as FindOptionsWhere<T>;

    if (!options?.id || typeof options.id !== 'string') {
      throw new Error('Invalid or missing ID');
    }

    const redisResponse = await this.redisService.get(options.id);

    if (redisResponse && redisResponse !== 'null') {
      return JSON.parse(redisResponse) as T;
    }

    const response = await this.entity.findOneBy(options);

    if (!response) {
      throw new Error('User not found');
    }

    await this.redisService.set(options.id, JSON.stringify(response));

    return response;
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

  public async saveOne(data: DeepPartial<T>, index?: string): Promise<T> {
    const response = await this.entity.save(data);
    if (index) {
      const { id, ...docs } = response;
      await this.elasticsearchService.createIndex({
        index,
        id,
        body: docs as T,
      });
    }
    return response;
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  public async update(id: string, data: DeepPartial<T>, index?: string): Promise<void> {
    await this.redisService.del(id);

    if (index) {
      await this.elasticsearchService.updateIndex({
        index,
        id,
        body: data as T,
      });
    }

    await this.entity.update(id, data);
  }

  public async remove(data: T, index?: string): Promise<T> {
    await this.redisService.del(data.id);

    if (index) {
      await this.elasticsearchService.deleteIndex({
        index,
        id: data.id,
      });
    }

    return await this.entity.remove(data);
  }
}
