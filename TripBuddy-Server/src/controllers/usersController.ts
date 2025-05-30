import {BaseController} from '@controllers/baseController';
import {RequestWithUserId} from '@customTypes/request';
import {TripPreview} from '@customTypes/Trip';
import tripModel from '@models/tripModel';
import {IUser, userModel} from '@models/usersModel';
import {userToUserResponse} from '@utils/mappers';
import {sendError} from '@utils/sendError';
import {Request, Response} from 'express';
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
        response.send(userToUserResponse(user));
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

  async updateUserDescription(request: RequestWithUserId, response: Response) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        {_id: request.userId},
        {$set: {description: request.body.description}},
        {new: true}
      );

      if (updatedUser) {
        response.send(updatedUser);
      } else {
        sendError(response, StatusCodes.NOT_FOUND, 'User not found');
      }
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed updating user description', JSON.stringify(error));
    }
  }

  async updateUserDetails(request: RequestWithUserId, response: Response) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        {_id: request.userId},
        {
          $set: {
            age: request.body.age,
            diet: request.body.diet,
            religion: request.body.religion,
            gender: request.body.gender,
          },
        },
        {new: true}
      );

      if (updatedUser) {
        response.send(updatedUser);
      } else {
        sendError(response, StatusCodes.NOT_FOUND, 'User not found');
      }
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed updating user details', JSON.stringify(error));
    }
  }
}

export default new UsersController();
