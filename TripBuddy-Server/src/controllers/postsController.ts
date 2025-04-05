import { Request, Response } from 'express';
import { BaseController } from '@controllers/baseController';
import { IPost, postModel } from '@models/postsModel';
import { RequestWithUserId } from '@customTypes/request';
import { commentModel } from '@models/commentsModel';
import { userModel } from '@models/usersModel';
import { sendError } from '@utils/sendError';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }

  async getAll(request: Request, response: Response) {
    const userId = request.query.userId;

    try {
      let posts;

      if (userId) {
        posts = await this.model.find({ userId });
      } else {
        posts = await this.model.find();
      }

      const mappedPost = await Promise.all(
        posts.map(async (item) => {
          const commentCount = await commentModel.countDocuments({
            postId: item._id,
          });
          const postUser = await userModel.findById(item.userId);

          return {
            ...item.toObject(),
            commentCount,
            user: {
              _id: postUser?._id.toString(),
              userName: postUser?.userName,
              profileImageUrl: postUser?.profileImageUrl,
            },
          };
        }),
      );

      response.send(mappedPost);
    } catch (error) {
      sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed fetching posts',
        JSON.stringify(error)
      );
    }
  }

  async getPostById(request: Request, response: Response) {
    const id = request.params.id;

    try {
      const post = await this.model.findById(id);

      if (post) {
        const commentCount = await commentModel.countDocuments({
          postId: post._id,
        });
        const postUser = await userModel.findById(post.userId);

        response.send({
          ...post.toObject(),
          commentCount,
          user: {
            _id: postUser?._id.toString(),
            userName: postUser?.userName,
            profileImageUrl: postUser?.profileImageUrl,
          },
        });
      } else {
        response.status(StatusCodes.NOT_FOUND).send('Post not found');
      }
    } catch (error) {
      sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed fetching post by id',
        JSON.stringify(error)
      );
    }
  }

  async handleLike(request: RequestWithUserId, response: Response) {
    const { postId } = request.params;
    const userId = request.userId as unknown as Types.ObjectId

    try {
      const post = await this.model.findById(postId);
      if (!post) {
        return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed fetching post by id');
      }

      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id.toString() !== request.userId);
      } else {
        post.likes.push(userId);
      }

      await post.save();
      response.status(StatusCodes.OK).send(post);
    } catch (error) {
      sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed liking the post',
        JSON.stringify(error)
      );
    }
  }
}

export default new PostsController();
