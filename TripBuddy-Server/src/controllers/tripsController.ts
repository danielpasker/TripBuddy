import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '@utils/sendError';
import Trip, { ITrip } from '@models/tripModel';
import tripModel from '@models/tripModel';
import { userModel } from '@models/usersModel';
import { TripFilters } from '@customTypes/filteredTrips';
import { RequestWithUserId } from '@customTypes/request';
import { UserResponse } from '@customTypes/UserResponse';
import { searchLocationWithDetails } from '@externalApis/osm';
import { userToUserResponse } from '@utils/mappers';
import { searchAlerts } from '@externalApis/alerts';
import { getCountryNameFromCountryCode } from '@utils/countryUtils';
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
        const mappedUsers = users.map(user => userToUserResponse(user));
        const mappedTrip = {
          ...trip.toObject(),
          country: getCountryNameFromCountryCode(trip.plan.countryCode),
          users: mappedUsers,
        };

        response.send(mappedTrip);
      } else {
        return sendError(response, StatusCodes.NOT_FOUND, `Trip with id ${request.params.id} not found`);
      }
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch trip', error);
    }
  }

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

  async getFilteredTrips(request: RequestWithUserId, response: Response) {
    const filters = request.query as unknown as TripFilters;
    const [locationDetails] = await searchLocationWithDetails(filters.location);

    try {
      const initiallyFilteredTrips = await tripModel.find({
        startDate: { $lte: new Date(filters.endDate) },
        endDate: { $gte: new Date(filters.startDate) },
        'plan.countryCode': locationDetails.address?.country_code?.toUpperCase(),
        isOpenToJoin: true,
        users: { $ne: request.userId },
      });

      const scoredTrips = await Promise.all(initiallyFilteredTrips.map(async trip => this.scoreTrip(trip, filters)));
      const sorted = scoredTrips.sort((a, b) => b.score - a.score).slice(0, 20);

      response.json(sorted.map(s => s.mappedTrip));
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch filtered fields', error);
    }
  }

  private async scoreTrip(trip: ITrip, filters: TripFilters) {
    let score = 0;

    const users = await userModel.find({ _id: { $in: trip.users } });

    const mappedUsers = users.map(user => userToUserResponse(user));
    const mappedTrip = { ...trip.toObject(), users: mappedUsers } as Omit<ITrip, 'users'> & { users: UserResponse[] };

    const usersProperties = {
      religions: users.map(user => user.religion).filter(religion => religion !== null),
      genders: users.map(user => user.gender).filter(gender => gender !== null),
      ages: users.map(user => user.age).filter(age => age !== null),
      diets: users.map(user => user.diet).filter(diet => diet !== null),
    };

    if (filters.tripType?.includes(trip.plan.tripType)) {
      score += 10;
    }

    // --- Budget (10 pts) ---
    const tripBudget = +trip.plan.budget.split(' ')[0];
    if (!isNaN(tripBudget)) {
      if (tripBudget <= filters.budget) score += 10;
      else if (tripBudget <= filters.budget * 1.2) score += 5;
    }

    // --- Participants (5 pts) ---
    if (trip.plan.participants <= filters.maxParticipants) score += 5;

    // --- Gender (10 pts) ---
    const matchingGenders = usersProperties.genders.filter(gender => filters.gender?.includes(gender));
    if (users.length > 0) score += (matchingGenders.length / users.length) * 10;

    // --- Religion (10 pts) ---
    const matchingReligions = usersProperties.religions.filter(religion => filters.religion?.includes(religion));
    if (users.length > 0) score += (matchingReligions.length / users.length) * 10;

    // --- Diet (10 pts) ---
    const matchingDiets = usersProperties.diets.filter(diet => filters.dietaryPreferences?.includes(diet));
    if (users.length > 0) score += (matchingDiets.length / users.length) * 10;

    // --- Average Age (15 pts) ---
    if (usersProperties.ages.length > 0) {
      const avgAge = usersProperties.ages.reduce((sum, age) => sum + age, 0) / usersProperties.ages.length;
      const ageDiff = Math.abs(avgAge - (filters.averageAge ?? 0));
      if (ageDiff <= 3) score += 15;
      else if (ageDiff <= 7) score += 8;
    }

    // --- Date Overlap (15 pts) ---
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);
    const filterStart = new Date(filters.startDate);
    const filterEnd = new Date(filters.endDate);

    // Calculate overlapping range
    const overlapStart = new Date(Math.max(tripStart.getTime(), filterStart.getTime()));
    const overlapEnd = new Date(Math.min(tripEnd.getTime(), filterEnd.getTime()));

    if (overlapStart < overlapEnd) {
      const overlapDays = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24));
      const tripDays = Math.ceil((tripEnd.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24));
      const overlapRatio = Math.min(overlapDays / tripDays, 1);
      score += overlapRatio * 15;
    }

    return { mappedTrip, score };
  }
}

export default new TripsController();
