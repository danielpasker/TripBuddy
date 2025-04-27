import request from 'supertest';
import mongoose from 'mongoose';
import {Express} from 'express';
import {initApp} from '../server';
import {prepareUserForTests} from './prepareTests';
import Trip from '../models/tripModel';

let app: Express;
let userId = '';
let userAccessToken = '';
const createdTripIds: string[] = [];

beforeAll(async () => {
  app = await initApp();
  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;
});

afterAll(async () => {
  await Trip.deleteMany({_id: {$in: createdTripIds}});
  await mongoose.connection.close();
});

describe('POST /trip', () => {
  it('✅ should save a valid trip and return 201', async () => {
    const validTrip = {
      startDate: '2025-05-01',
      endDate: '2025-05-10',
      users: [userId],
      plan: [
        {
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
      ],
    };

    const response = await request(app)
      .post('/trip')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send(validTrip)
      .expect(201);
    createdTripIds.push(response.body._id);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.startDate).toBe(validTrip.startDate);
    expect(response.body.plan.length).toBe(1);
  });

  it('❌ should fail to save an invalid trip and return 400', async () => {
    const invalidTrip = {
      endDate: '2025-05-10',
      users: [],
      plan: [],
    };

    const response = await request(app)
      .post('/trip')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send(invalidTrip)
      .expect(400);

    expect(response.text).toBeDefined();
    expect(response.text).toBe('Missing or invalid required fields');
  });

  it('❌ should block trip creation without authorization', async () => {
    const validTrip = {
      startDate: '2025-05-01',
      endDate: '2025-05-10',
      users: [userId],
      plan: [
        {
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
      ],
    };

    const response = await request(app).post('/trip').send(validTrip).expect(401);

    expect(response.text).toBeDefined();
    expect(response.text).toBe('missing token');
  });
});
