import {Request, Response} from 'express';
import {createPrompt, TripPlan} from '@utils/TripPlanConfig';
import {GoogleGenerativeAI} from '@google/generative-ai';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const http = rateLimit(axios.create(), {maxRequests: 4, perMilliseconds: 1000});
const OPENSTREETMAP_API_URL = 'https://nominatim.openstreetmap.org/search';

class TripPlanController {
  async generateTripPlan(prompt: any): Promise<TripPlan> {
    const aiApiKey = process.env.AI_API_KEY;

    if (!aiApiKey) {
      throw new Error('AI_API_KEY is not defined.');
    }

    const genAI = new GoogleGenerativeAI(aiApiKey);
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
    const result = await model.generateContent(prompt);

    try {
      return JSON.parse(
        result.response.text().split('json')[1].split('```')[0],
      ) as TripPlan;
    } catch (e) {
      throw new Error('Failed to generate trip plan. Error: ' + e);
    }
  }

  async verifyLocation(query: string): Promise<{isValid: boolean; details: any}> {
    try {
      const response = await http.get(
        OPENSTREETMAP_API_URL,
        {
          params: {q: query, format: 'json'},
        },
      );

      if (response.data.length > 0) {
        return {
          isValid: true,
          details: response.data[0],
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
              console.error(`Failed to verify activity: ${activity.activity} at location: ${activity.location}. Details:`, validationResponse.details);

              return null;
            }

            return activity;
          }),
        );

        return {
          ...dayPlan,
          activities: verifiedActivities.filter(activity => activity !== null),
        };
      }),
    );

    return {
      ...tripPlan,
      plan: verifiedPlan.filter(dayPlan => dayPlan.activities.length > 0),
    };
  }


  async createTripPlan(req: Request, res: Response) {
    try {
      const tripPlanPrompt = createPrompt(req.body);
      const tripPlan = await this.generateTripPlan(tripPlanPrompt);
      const verifiedTripPlan = await this.verifyTripPlan(tripPlan);

      if (!verifiedTripPlan) {
        res.status(500).json({error: 'Failed to generate trip plans.'});
      }

      res.json(verifiedTripPlan);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      res.status(500).json({error: 'Failed to plan the trip.'});
    }
  }
}

export default new TripPlanController();
