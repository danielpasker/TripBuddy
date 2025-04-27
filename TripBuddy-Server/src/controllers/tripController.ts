import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {sendError} from '@utils/sendError';
import Trip from '@models/tripModel';

class TripController {
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
}

export default new TripController();
