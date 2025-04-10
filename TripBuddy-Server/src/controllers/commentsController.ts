import {Request, Response} from 'express';
import {commentModel, IComments} from '@models/commentsModel';
import {postModel} from '@models/postsModel';
import {BaseController} from '@controllers/baseController';
import {StatusCodes} from 'http-status-codes';
import {sendError} from '@utils/sendError';
import {RequestWithUserId} from '@customTypes/request';

class CommentsController extends BaseController<IComments> {
  constructor() {
    super(commentModel);
  }

  async create(request: RequestWithUserId, response: Response) {
    const postId = request.body.postId;

    try {
      const post = await postModel.findById(postId);
      if (!post) response.status(StatusCodes.NOT_FOUND).send(`Post with id ${postId} was not found`);

      const newComment = {
        ...request.body,
        userId: request.userId,
      };

      request.body = newComment;

      return await super.create(request, response);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed creating comment', JSON.stringify(error));
    }
  }

  async getAll(request: Request, response: Response) {
    const postId = request.query.postId;

    try {
      if (postId) {
        const post = await postModel.findById(postId);
        if (!post) response.status(StatusCodes.NOT_FOUND).send(`Post with id ${postId} was not found`);

        const comments = await this.model.find({postId});
        response.send(comments);
      } else {
        const comments = await this.model.find();
        response.send(comments);
      }
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed fetching comments', JSON.stringify(error));
    }
  }

  async deleteCommentsByPostId(request: Request, response: Response) {
    const postId = request.query.postId;

    try {
      await this.model.deleteMany({postId});
      response.send(`Comments for post with id ${postId} were deleted`);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed deleting comments', JSON.stringify(error));
    }
  }
}

export default new CommentsController();
