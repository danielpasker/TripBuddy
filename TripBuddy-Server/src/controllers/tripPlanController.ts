import {Request, Response} from 'express';
import {createPrompt, TripPlan} from '@utils/TripPlanConfig';
import {getAiResponse} from '@externalApis/gemini';
import {OsmResult, searchLocation} from '@externalApis/osm';
import {StatusCodes} from 'http-status-codes';
import {sendError} from '@utils/sendError';
import TripModel from '@models/tripModel';

class TripPlanController {
  async generateTripPlan(prompt: string): Promise<TripPlan> {
    const response = await getAiResponse(prompt);

    try {
      return JSON.parse(response.text().split('json')[1].split('```')[0]) as TripPlan;
    } catch (error) {
      throw new Error('Failed to generate trip plan. Error: ' + error);
    }
  }

  async verifyLocation(query: string): Promise<{isValid: boolean; details: OsmResult | string}> {
    try {
      const locations = await searchLocation(query);

      if (locations.length > 0) {
        return {
          isValid: true,
          details: locations[0],
        };
      } else {
        return {
          isValid: false,
          details: `Location not found.`,
        };
      }
    } catch (error) {
      console.error(`Verification error for query "${query}":`, (error as Error).message);

      return {
        isValid: false,
        details: 'Verification API error.',
      };
    }
  }

  async verifyTripPlan(tripPlan: TripPlan): Promise<TripPlan> {
    const verifiedPlan = await Promise.all(
      tripPlan.plan.map(async dayPlan => {
        const verifiedActivities = await Promise.all(
          dayPlan.activities.map(async activity => {
            const validationResponse = await this.verifyLocation(activity.location);

            if (!validationResponse.isValid) {
              console.error(
                `Failed to verify activity: ${activity.activity} at location: ${activity.location}. Details:`,
                validationResponse.details
              );
            }

            return {...activity, isValid: validationResponse.isValid};
          })
        );

        return {
          ...dayPlan,
          activities: verifiedActivities,
        };
      })
    );

    return {
      ...tripPlan,
      plan: verifiedPlan.filter(dayPlan => dayPlan.activities.length > 0),
    };
  }

  async createTripPlan(request: Request, response: Response) {
    try {
      const tripPlanPrompt = createPrompt(request.body);
      const tripPlan = await this.generateTripPlan(tripPlanPrompt);
      const verifiedTripPlan = await this.verifyTripPlan(tripPlan);

      if (!verifiedTripPlan) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to generate trip plans.'});
      }

      response.json(verifiedTripPlan);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create trip plan', JSON.stringify(error));
    }
  }

  async addActivity(request: Request, response: Response) {
    const {tripId} = request.params;
    const {day, activity, location} = request.body;

    if (!day || !activity || !location) {
      return sendError(response, StatusCodes.BAD_REQUEST, 'Missing required fields');
    }

    const trip = await TripModel.findById(tripId);

    if (!trip) {
      return sendError(response, StatusCodes.BAD_REQUEST, 'Trip was not found');
    }

    const dayPlan = trip.plan.plan.find(d => d.day === day);

    if (!dayPlan) {
      return sendError(response, StatusCodes.BAD_REQUEST, 'Day not found in trip plan');
    }

    dayPlan.activities.push({activity, location, isCustom: true, isValid: false});
    await trip.save();

    response.status(200).json(trip.plan);
  }
}

export default new TripPlanController();
