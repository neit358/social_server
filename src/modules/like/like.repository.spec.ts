import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '../../services/elasticsearch.service';
import { RedisService } from '../../services/redis.service';
import { LikeRepository } from './like.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';

describe('LikeRepository', () => {
  let likeRepository: LikeRepository;

  let mockLikeRepository = {};
  let mockRedisService = {};
  let mockSearchService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeRepository,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
        {
          provide: getRepositoryToken(Like), // @InjectRepository(Like) is used in the repository
          useValue: mockLikeRepository,
        },
      ],
    }).compile();

    likeRepository = module.get<LikeRepository>(LikeRepository);
  });

  it('should be defined', () => {
    expect(likeRepository).toBeDefined();
  });
});
