import {Request, Response} from 'express';
import mongoose from 'mongoose';
import {StatusCodes} from 'http-status-codes';
import tripModel from '@models/tripModel';
import {sendError} from '@utils/sendError';
import joinRequestsModel from '@models/joinRequestsModel';
import JoinRequest from '@models/joinRequestsModel';
import {RequestWithUserId} from '@customTypes/request';
import {userModel} from '@models/usersModel';
import {userToUserResponse} from '@utils/mappers';

class JoinRequestController {
  async createJoinRequest(request: RequestWithUserId, response: Response): Promise<void> {
    try {
      const {tripId} = request.body;
      const userId = request.userId;

      if (!userId || !tripId) {
        return sendError(response, StatusCodes.BAD_REQUEST, 'Missing required fields');
      }
      if (await joinRequestsModel.exists({userId, tripId})) {
        return sendError(response, StatusCodes.CONFLICT, 'Join request already exists');
      }

      const newJoinRequest = new JoinRequest({
        userId,
        tripId,
      });

      const savedJoinRequest = await newJoinRequest.save();
      response.status(StatusCodes.CREATED).json(savedJoinRequest);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create join request', JSON.stringify(error));
    }
  }

  async getJoinRequestsByTripAndUser(request: RequestWithUserId, response: Response): Promise<void> {
    try {
      const {tripId} = request.params;
      const userId = request.userId;

      if (!tripId || !userId) {
        return sendError(response, StatusCodes.BAD_REQUEST, 'Missing required fields');
      }

      const joinRequests = await joinRequestsModel.find({
        tripId,
        isActive: true,
        approvingUsers: {$ne: userId},
      });

      const mappedJoinRequests = await Promise.all(
        joinRequests.map(async joinRequest => {
          const user = await userModel.findById(joinRequest.userId);
          const approvingUsers = await userModel.find({_id: {$in: joinRequest.approvingUsers}});

          if (!user) {
            sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve user for join request');
            return null;
          }

          return {
            ...joinRequest.toObject(),
            user: userToUserResponse(user),
            approvingUsers: approvingUsers.map(user => userToUserResponse(user)),
          };
        })
      );

      response.status(StatusCodes.OK).json(mappedJoinRequests);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve join requests', JSON.stringify(error));
    }
  }

  async approve(request: RequestWithUserId, response: Response): Promise<void> {
    try {
      const userId = request.userId as unknown as mongoose.Types.ObjectId;
      const {id} = request.params;

      const joinRequest = await joinRequestsModel.findById(id);

      if (!joinRequest || !joinRequest.isActive) {
        return sendError(response, StatusCodes.NOT_FOUND, 'Join request was not found or inactive');
      }
      if (userId && !joinRequest.approvingUsers.includes(userId)) {
        joinRequest.approvingUsers.push(userId);
      }

      const trip = await tripModel.findById(joinRequest.tripId);

      if (!trip) {
        return sendError(response, StatusCodes.NOT_FOUND, 'Trip was not found');
      }
      if (trip.users.every(user => joinRequest.approvingUsers.includes(user))) {
        trip.users.push(joinRequest.userId);
        await trip.save();

        joinRequest.isActive = false;
      }

      await joinRequest.save();

      const tripUsers = await userModel.find({_id: {$in: trip.users}});
      const mappedTrip = {...trip.toObject(), users: tripUsers.map(user => userToUserResponse(user))};

      response.status(StatusCodes.OK).json(mappedTrip);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to approve join request', JSON.stringify(error));
    }
  }

  async decline(request: Request, response: Response): Promise<void> {
    try {
      const {id} = request.params;
      const joinRequest = await joinRequestsModel.findById(id);

      if (!joinRequest || !joinRequest.isActive) {
        return sendError(response, StatusCodes.NOT_FOUND, 'Join request was not found or inactive');
      }

      joinRequest.isActive = false;
      await joinRequest.save();

      response.status(StatusCodes.OK).json(joinRequest);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to decline join request', JSON.stringify(error));
    }
  }
}

export default new JoinRequestController();
