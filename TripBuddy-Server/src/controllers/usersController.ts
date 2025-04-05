import {Request, Response} from 'express';
import {BaseController} from '@controllers/baseController';
import {IUser, userModel} from '@models/usersModel';
import {UserResponse} from '@customTypes/userResponse';
import {sendError} from '@utils/sendError';
import {StatusCodes} from 'http-status-codes';

class UsersController extends BaseController<IUser> {
  constructor() {
    super(userModel);
  }

  async getUserById(request: Request, response: Response) {
    const id = request.params.id;

    try {
      const user = await this.model.findById(id);

      if (user) {
        const userResponse: UserResponse = {
          _id: user._id.toString(),
          userName: user.userName,
          profileImageUrl: user.profileImageUrl,
        };
        response.send(userResponse);
      } else {
        response.status(StatusCodes.NOT_FOUND).send('User not found');
      }
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed fetching user by id', JSON.stringify(error));
    }
  }
}

export default new UsersController();
