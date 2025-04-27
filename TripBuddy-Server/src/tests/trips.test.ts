import request from 'supertest';
import mongoose from 'mongoose';
import {Express} from 'express';
import {initApp} from '../server';
import tripModel from '../models/tripModel';

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/trips', () => {
  it('✅ should save a valid trip and return 201', async () => {
    const validTrip = {
      startDate: '2025-05-01',
      endDate: '2025-05-10',
      users: ['609e129e2f8fb814b56fa181'],
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
    };

    const response = await request(app).post('/api/trips').send(validTrip).expect(201);

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

    const response = await request(app).post('/api/trips').send(invalidTrip).expect(400);

    expect(response.body.error).toBeDefined();
  });
});
