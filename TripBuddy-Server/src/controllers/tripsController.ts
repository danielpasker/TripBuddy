import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '@utils/sendError';
import Trip from '@models/tripModel';
import tripModel from '@models/tripModel';
import { userModel } from '@models/usersModel';
import { userToUserUserResponse } from '@utils/mappers';
import { TripFilters } from '@customTypes/filteredTrips';

class TripsController {
  async saveTrip(request: Request, response: Response): Promise<void> {
    try {
      const { startDate, endDate, users, plan } = request.body;

      if (!startDate || !endDate || !Array.isArray(users) || users.length === 0 || !plan || plan.length === 0) {
        return sendError(response, StatusCodes.BAD_REQUEST, 'Missing or invalid required fields');
      }

      const newTrip = new Trip({
        startDate,
        endDate,
        users,
        plan,
      });

      const savedTrip = await newTrip.save();

      response.status(StatusCodes.CREATED).json(savedTrip);
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to save the trip', JSON.stringify(error));
    }
  }

  async getTripById(request: Request, response: Response) {
    try {
      const trip = await tripModel.findById(request.params.id);

      if (trip) {
        const users = await userModel.find({ _id: { $in: trip.users } });
        const mappedUsers = users.map(user => userToUserUserResponse(user));
        const mappedTrip = { ...trip.toObject(), users: mappedUsers };

        response.send(mappedTrip);
      } else {
        return sendError(response, StatusCodes.NOT_FOUND, `Trip with id ${request.params.id} not found`);
      }
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch trip', JSON.stringify(error));
    }
  };

  async getTripPlanByTripId(request: Request, response: Response) {
    const tripId = request.params.tripId;

    try {
      const trip = await tripModel.findById(tripId);

      if (trip) {
        response.send(trip.plan);
      } else {
        response.status(StatusCodes.NOT_FOUND).send('Trip was not found');
      }
    } catch (error) {
      sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed fetching trip plan by trip id',
        JSON.stringify(error)
      );
    }
  }

  async setIsOpenToJoin(request: Request, response: Response) {
    const tripId = request.params.tripId;
    const { isOpenToJoin } = request.body;

    try {
      const trip = await tripModel.findById(tripId);

      if (!trip) {
        return sendError(response, StatusCodes.NOT_FOUND, 'Trip was not found');
      }

      trip.isOpenToJoin = isOpenToJoin;
      await trip.save();

      response.sendStatus(StatusCodes.OK);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update trip', JSON.stringify(error));
    }
  }
  async getFilteredTrips(request: Request, response: Response) {
    const filters = request.body as TripFilters

    const initiallyFilteredTrips = tripModel.find({
      startDate: { $gte: filters.startDate },
      endDate: { $lte: filters.endDate },
      plan: {

      }
    })

  }
}

export default new TripsController();
