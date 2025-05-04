import request from 'supertest';
import mongoose, {Types} from 'mongoose';
import {Express} from 'express';
import {initApp} from '../server';
import {prepareUserForTests} from './prepareTests';
import Trip from '../models/tripModel';

let app: Express;
let userId = '';
let userAccessToken = '';
const createdTripIds: string[] = [];

const exampleTrip = {
  startDate: '2025-05-01',
  endDate: '2025-05-10',
  users: [''],
  plan: {
    location: 'Paris',
    countryCode: 'FR',
    days: 5,
    budget: 'Medium',
    participants: 1,
    plan: [
      {
        day: 1,
        activities: [
          {
            activity: 'Visit Eiffel Tower',
            location: 'Paris',
            isValid: true,
          },
        ],
      },
    ],
  },
};

beforeAll(async () => {
  app = await initApp();
  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;
  exampleTrip.users = [userId];
});

afterAll(async () => {
  await Trip.deleteMany({_id: {$in: createdTripIds}});
  await mongoose.connection.close();
});

describe('TripsController', () => {
  describe('saveTrip', () => {
    test('✅ should save a valid trip and return 201', async () => {
      const response = await request(app)
        .post('/trips')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(exampleTrip)
        .expect(201);
      createdTripIds.push(response.body._id);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.startDate).toBe(exampleTrip.startDate);
      expect(response.body.plan).toHaveProperty('location', exampleTrip.plan.location);
    });

    test('❌ should fail to save an invalid trip and return 400', async () => {
      const invalidTrip = {
        endDate: '2025-05-10',
        users: [],
        plan: [],
      };

      const response = await request(app)
        .post('/trips')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(invalidTrip)
        .expect(400);

      expect(response.text).toBeDefined();
      expect(response.text).toBe('Missing or invalid required fields');
    });

    test('❌ should block trip creation without authorization', async () => {
      const response = await request(app).post('/trips').send(exampleTrip).expect(401);

      expect(response.text).toBeDefined();
      expect(response.text).toBe('missing token');
    });
  });

  describe('getTripById', () => {
    let tripId: string;

    beforeAll(async () => {
      const tripResponse = await request(app)
        .post('/trips')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(exampleTrip);
      tripId = tripResponse.body._id;
      createdTripIds.push(tripId);
    });

    test('returns trip details for a valid trip ID', async () => {
      const response = await request(app).get(`/trips/${tripId}`).set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', tripId);
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('plan');
    });

    test('returns 404 for a non-existent trip ID', async () => {
      const invalidTripId = new Types.ObjectId();
      const response = await request(app)
        .get(`/trips/${invalidTripId}`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe(`Trip with id ${invalidTripId._id} not found`);
    });
  });

  describe('getTripPlanByTripId', () => {
    let tripId: string;

    beforeAll(async () => {
      const tripResponse = await request(app)
        .post('/trips')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(exampleTrip);
      tripId = tripResponse.body._id;
    });

    test('returns trip plan for a valid trip ID', async () => {
      const response = await request(app)
        .get(`/trips/${tripId}/plan`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('location');
      expect(response.body).toHaveProperty('plan');
    });

    test('returns 404 for a non-existent trip ID', async () => {
      const response = await request(app)
        .get(`/trips/${new Types.ObjectId()}/plan`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Trip was not found');
    });
  });
});
