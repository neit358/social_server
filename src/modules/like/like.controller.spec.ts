import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { JwtService } from '@nestjs/jwt';

describe('LikeController', () => {
  let likeService: LikeService;
  let likeController: LikeController;

  const mockLikeService = {
    getLikesByPostId: jest.fn(),
    getLike: jest.fn(),
    actionLike: jest.fn(),
  };

  const mockResponseArray = {
    statusCode: 200,
    message: 'Likes found',
    data: [],
  };

  const mockResponseItem = {
    statusCode: 200,
    message: 'Likes found',
    data: {
      isLiked: true,
    },
  };

  const requestData = {
    postId: 'valid-post-id',
    userId: 'valid-user-id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeController,
        {
          provide: LikeService,
          useValue: mockLikeService,
        },
        {
          provide: JwtService,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
    likeController = module.get<LikeController>(LikeController);
  });

  describe('getLikesByPostId', () => {
    it('should return likes when postId is valid', async () => {
      (likeService.getLikesByPostId as jest.Mock).mockResolvedValue(mockResponseArray);
      const likes = await likeController.getLikesByPostId(requestData.postId);
      expect(likes).toEqual(mockResponseArray);

      expect(mockLikeService.getLikesByPostId).toHaveBeenCalledWith(requestData.postId);
    });
  });

  describe('getLike', () => {
    it('should return like when postId, userId is valid', async () => {
      (likeService.getLike as jest.Mock).mockResolvedValue(mockResponseItem);
      const likes = await likeController.getLike(requestData);
      expect(likes).toEqual(mockResponseItem);

      expect(mockLikeService.getLike).toHaveBeenCalledWith(requestData);
    });
  });

  describe('actionLike', () => {
    it('should return likes when postId is valid', async () => {
      (likeService.actionLike as jest.Mock).mockResolvedValue(mockResponseItem);
      const likes = await likeController.actionLike(requestData);
      expect(likes).toEqual(mockResponseItem);

      expect(mockLikeService.actionLike).toHaveBeenCalledWith(requestData);
    });
  });
});
