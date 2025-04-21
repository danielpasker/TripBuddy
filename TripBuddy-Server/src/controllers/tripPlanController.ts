import { Request, Response } from 'express';
import { createPrompt, TripPlan } from '@utils/TripPlanConfig';
import { getAiResponse } from '@externalApis/gemini';
import { OsmResult, searchLocation } from '@externalApis/osm';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '@utils/sendError';
import Trip from '@models/tripModel';

class TripPlanController {
  async generateTripPlan(prompt: string): Promise<TripPlan> {
    const response = await getAiResponse(prompt);

    try {
      return JSON.parse(response.text().split('json')[1].split('```')[0]) as TripPlan;
    } catch (error) {
      throw new Error('Failed to generate trip plan. Error: ' + error);
    }
  }

  async verifyLocation(query: string): Promise<{ isValid: boolean; details: OsmResult | string }> {
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

              return null;
            }

            return activity;
          })
        );

        return {
          ...dayPlan,
          activities: verifiedActivities.filter(activity => activity !== null),
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
         response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to generate trip plans.' });
      }

      response.json(verifiedTripPlan);
    } catch (error) {
      sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create trip plan', JSON.stringify(error));
    }
  }

  /**
   * Save the trip to the database (after user confirmation).
   * @param {Object} tripPlan The trip plan data to save.
   * @param {Array} users List of users to associate with the trip.
   * @param {Date} startDate The start date of the trip.
   * @param {Date} endDate The end date of the trip.
   */
  async saveTripPlan(request: Request, response: Response): Promise<void> {
    try {
      const { startDate, endDate, users, plan } = request.body;
  
      // Ensure the required fields are present
      if (!startDate || !endDate || !users || !plan) {
         response.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
         return;
      }
  
      // Log the plan field to verify the structure
      console.log('Received plan data:', JSON.stringify(plan, null, 2));  // Log full structure of plan
  
      // Create the new trip with the plan and users
      const newTrip = new Trip({
        startDate,
        endDate,
        users,  
        plan,   // Save plan as passed from frontend
      });
  
      console.log('New trip object:', JSON.stringify(newTrip, null, 2));  // Log new trip object before saving
  
      // Save the new trip
      const savedTrip = await newTrip.save();
  
      console.log('Saved trip:', JSON.stringify(savedTrip, null, 2));  // Log saved trip for debugging
  
      response.status(StatusCodes.CREATED).json(savedTrip);
    } catch (error) {
      console.error('Error saving trip:', error);
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to save the trip' });
    }
  }
  
  
  
}

export default new TripPlanController();
