import {Request, Response} from 'express';
import {BaseController} from '@controllers/baseController';
import {IUser, userModel} from '@models/usersModel';
import {UserResponse} from '@customTypes/UserResponse';
import {sendError} from '@utils/sendError';
import {StatusCodes} from 'http-status-codes';
import {TripPreview} from '@customTypes/Trip';
import tripModel from '@models/tripModel';
import {RequestWithUserId} from '@customTypes/request';

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

  async getUserTrips(request: Request, response: Response) {
    const userId = request.params.userId;

    try {
      const trips = await tripModel.find({users: {$in: userId}});

      if (trips) {
        const mappedTrips: TripPreview[] = trips.map(trip => ({
          _id: trip._id.toString(),
          startDate: trip.startDate,
          endDate: trip.endDate,
          location: trip.plan.location,
          countryCode: trip.plan.countryCode,
        }));

        response.send(mappedTrips);
      } else {
        sendError(response, StatusCodes.NOT_FOUND, 'trips not found');
      }
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed fetching user trips', JSON.stringify(error));
    }
  }

  async updateProfileImage(request: RequestWithUserId, response: Response) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        {_id: request.userId},
        {$set: {profileImageUrl: request.body.imageUrl}},
        {new: true}
      );

      if (updatedUser) {
        response.send(updatedUser);
      } else {
        sendError(response, StatusCodes.NOT_FOUND, 'User not found');
      }
    } catch (error) {
      sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed updating user profile image',
        JSON.stringify(error)
      );
    }
  }
}

export default new UsersController();
