import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '@utils/sendError';
import Trip from '@models/tripModel';

class TripController {
  /**
   * Save the trip to the database (after user confirmation).
   */
  async saveTrip(request: Request, response: Response): Promise<void> {
    try {
      const { startDate, endDate, users, plan } = request.body;

      if (!startDate || !endDate || !Array.isArray(users) || !plan) {
        response.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing or invalid required fields' });
        return;
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
      console.error('Error saving trip:', error);
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to save the trip', JSON.stringify(error));
    }
  }
}

export default new TripController();
