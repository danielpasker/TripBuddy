import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {sendError} from '@utils/sendError';
import Trip from '@models/tripModel';
import tripModel from '@models/tripModel';
import {userModel} from '@models/usersModel';

class TripsController {
  async saveTrip(request: Request, response: Response): Promise<void> {
    try {
      const {startDate, endDate, users, plan} = request.body;

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

  getTripById = async (request: Request, response: Response) => {
    try {
      const trip = await tripModel.findById(request.params.id);

      if (trip) {
        const users = await userModel.find({_id: {$in: trip.users}});
        const mappedUsers = users.map(user => ({
          _id: user._id.toString(),
          userName: user.userName,
          profileImageUrl: user.profileImageUrl,
          description: user.description,
          age: user.age,
          gender: user.gender,
          religion: user.religion,
          diet: user.diet,
        }));
        const mappedTrip = {...trip.toObject(), users: mappedUsers};

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
}

export default new TripsController();
