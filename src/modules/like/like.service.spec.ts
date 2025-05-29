import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { LikeRepository } from './like.repository';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { HttpException } from '@nestjs/common';

describe('LikeService', () => {
  let likeService: LikeService;
  let likeRepository: LikeRepository;

  const mockLikeRepository = {
    findAll: jest.fn(),
    findByCondition: jest.fn(),
    createOne: jest.fn(),
    saveOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPostService = {
    findPostById: jest.fn(),
  };

  const mockUserService = {
    findUserById: jest.fn(),
  };

  const responseData = {
    statusCode: 200,
    message: 'Likes found',
    data: [],
  };

  const responseLikeData = {
    id: 'like-id',
    postId: 'post-id',
    userId: 'user-id',
  };

  const requestData = {
    postId: 'post-id',
    userId: 'user-id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: LikeRepository,
          useValue: mockLikeRepository,
        },
        {
          provide: PostService,
          useValue: mockPostService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
    likeRepository = module.get<LikeRepository>(LikeRepository);
  });

  it('should be defined', () => {
    expect(likeService).toBeDefined();
  });

  describe('Find likes', () => {
    it('should return likes data for a given post id', async () => {
      (likeRepository.findAll as jest.Mock).mockResolvedValue([]);
      const likes = await likeService.getLikesByPostId(requestData.postId);
      expect(likes).toEqual(responseData);

      expect(mockLikeRepository.findAll).toHaveBeenCalledWith({
        where: { postId: requestData.postId },
      });
    });

    it('should throw an error if likes not found', async () => {
      (likeRepository.findAll as jest.Mock).mockRejectedValue(new Error('Likes not found'));
      await expect(likeService.getLikesByPostId(requestData.postId)).rejects.toThrow(
        new HttpException('Likes not found', 404),
      );
      expect(mockLikeRepository.findAll).toHaveBeenCalledWith({
        where: { postId: requestData.postId },
      });
    });
  });

  describe('Find like', () => {
    it('should return like data for a given post id and user id', async () => {
      (likeRepository.findByCondition as jest.Mock).mockResolvedValue(responseLikeData);
      const like = await likeService.getLike({
        ...requestData,
      });

      expect(like).toEqual({
        statusCode: 200,
        message: 'Like found',
        data: {
          isLiked: true,
        },
      });
      expect(mockLikeRepository.findByCondition).toHaveBeenCalledWith({
        where: requestData,
      });
    });

    it('should return isLiked false if no like exists', async () => {
      (likeRepository.findByCondition as jest.Mock).mockResolvedValue(null);
      const like = await likeService.getLike(requestData);

      expect(like).toEqual({
        statusCode: 200,
        message: "Like wasn't found",
        data: {
          isLiked: false,
        },
      });
      expect(mockLikeRepository.findByCondition).toHaveBeenCalledWith({
        where: { postId: responseLikeData.postId, userId: responseLikeData.userId },
      });
    });

    it('should throw an error if like not found', async () => {
      (likeRepository.findByCondition as jest.Mock).mockRejectedValue(new Error('Like not found'));
      await expect(likeService.getLike(requestData)).rejects.toThrow(
        new HttpException('Like not found', 404),
      );
      expect(mockLikeRepository.findByCondition).toHaveBeenCalledWith({
        where: { postId: responseLikeData.postId, userId: responseLikeData.userId },
      });
    });
  });

  describe('Action like', () => {
    it('should remove like if it does exist', async () => {
      (likeRepository.findByCondition as jest.Mock).mockResolvedValue(responseLikeData);

      const liked = await likeService.actionLike(requestData);

      expect(liked).toEqual({
        statusCode: 200,
        message: 'Like deleted',
        data: {
          isLiked: false,
        },
      });

      expect(mockLikeRepository.findByCondition).toHaveBeenCalledWith({
        where: requestData,
      });
      expect(mockLikeRepository.remove).toHaveBeenCalledWith(responseLikeData);
      expect(mockPostService.findPostById).toHaveBeenCalledWith(requestData.postId);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(requestData.userId);
    });

    it('should throw an error if save like failed', async () => {
      (likeRepository.findByCondition as jest.Mock).mockResolvedValue(null);
      (likeRepository.createOne as jest.Mock).mockReturnValue(responseLikeData);
      (likeRepository.saveOne as jest.Mock).mockResolvedValue(null);

      await expect(likeService.actionLike(requestData)).rejects.toThrow(
        new HttpException('Like not found', 404),
      );

      expect(mockLikeRepository.findByCondition).toHaveBeenCalledWith({
        where: requestData,
      });
      expect(mockLikeRepository.createOne).toHaveBeenCalledWith(requestData);
      expect(mockLikeRepository.saveOne).toHaveBeenCalledWith(responseLikeData);
      expect(mockPostService.findPostById).toHaveBeenCalledWith(requestData.postId);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(requestData.userId);
    });

    it('should create like if it does not exist', async () => {
      (likeRepository.findByCondition as jest.Mock).mockResolvedValue(null);
      (likeRepository.createOne as jest.Mock).mockReturnValue(responseLikeData);
      (likeRepository.saveOne as jest.Mock).mockResolvedValue(responseLikeData);

      const liked = await likeService.actionLike(requestData);

      expect(liked).toEqual({
        statusCode: 200,
        message: 'Like created',
        data: {
          isLiked: true,
        },
      });

      expect(mockLikeRepository.findByCondition).toHaveBeenCalledWith({
        where: requestData,
      });
      expect(mockLikeRepository.createOne).toHaveBeenCalledWith(requestData);
      expect(mockLikeRepository.saveOne).toHaveBeenCalledWith(responseLikeData);
      expect(mockPostService.findPostById).toHaveBeenCalledWith(requestData.postId);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(requestData.userId);
    });

    it('should throw an error if like creation fails', async () => {
      (likeRepository.findByCondition as jest.Mock).mockRejectedValue(new Error('Like not found'));

      await expect(likeService.actionLike(requestData)).rejects.toThrow(
        new HttpException('Like not found', 404),
      );

      expect(mockLikeRepository.findByCondition).toHaveBeenCalledWith({
        where: requestData,
      });
      expect(mockLikeRepository.createOne).toHaveBeenCalledWith(requestData);
      expect(mockPostService.findPostById).toHaveBeenCalledWith(requestData.postId);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(requestData.userId);
    });
  });
});
