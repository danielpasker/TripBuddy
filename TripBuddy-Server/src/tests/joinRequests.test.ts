import request from 'supertest';
import {Express} from 'express';
import mongoose, {Types} from 'mongoose';
import {initApp} from '../server';
import {prepareUserForTests} from './prepareTests';
import tripModel from '../models/tripModel';
import joinRequestsModel from '../models/joinRequestsModel';
import {UserResponse} from '../types/UserResponse';

let app: Express;
let userAccessToken = '';
let userId = '';
let tripId_1 = '';
let tripId_2 = '';
let joinRequestId = '';

const exampleTrip = (userId: string) => ({
  startDate: '2025-05-01',
  endDate: '2025-05-10',
  users: [userId],
  plan: {
    location: 'Paris',
    countryCode: 'FR',
    days: 5,
    budget: 'Medium',
    participants: 1,
    tripType: 'Cultural',
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
});

beforeAll(async () => {
  app = await initApp();
  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;

  // Create a trips for join requests
  const exampleTripReq_1 = await request(app)
    .post('/trips')
    .set('Authorization', `Bearer ${userAccessToken}`)
    .send(exampleTrip(userId));
  tripId_1 = exampleTripReq_1.body._id;

  const exampleTripReq_2 = await request(app)
    .post('/trips')
    .set('Authorization', `Bearer ${userAccessToken}`)
    .send(exampleTrip(userId));
  tripId_2 = exampleTripReq_2.body._id;
});

afterAll(async () => {
  await joinRequestsModel.deleteMany({tripId: {$in: [tripId_1, tripId_2]}});
  await tripModel.deleteMany({_id: {$in: [tripId_1, tripId_2]}});
  await mongoose.connection.close();
});

describe('JoinRequestController', () => {
  describe('POST /join-requests', () => {
    test('creates a join request', async () => {
      const res = await request(app)
        .post('/join-requests')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({tripId: tripId_1});

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.tripId).toBe(tripId_1);
      expect(res.body.userId).toBe(userId);
      joinRequestId = res.body._id;
    });

    test('does not allow duplicate join requests', async () => {
      const res = await request(app)
        .post('/join-requests')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({tripId: tripId_1});

      expect(res.status).toBe(409);
    });

    test('fails with missing fields', async () => {
      const res = await request(app).post('/join-requests').set('Authorization', `Bearer ${userAccessToken}`).send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /join-requests/:tripId', () => {
    test('returns join requests for a trip', async () => {
      const res = await request(app)
        .get(`/join-requests/${tripId_1}`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('tripId', tripId_1);
    });

    test('fails with missing tripId', async () => {
      const res = await request(app).get('/join-requests/').set('Authorization', `Bearer ${userAccessToken}`);
      expect([404, 400]).toContain(res.status);
    });
  });

  describe('POST /join-requests/:id/approve', () => {
    test('approves a join request and adds user to trip', async () => {
      const res = await request(app)
        .post(`/join-requests/${joinRequestId}/approve`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('users');
      expect(res.body.users.some((u: UserResponse) => u._id === userId)).toBe(true);
    });

    test('fails if join request not found', async () => {
      const fakeId = new Types.ObjectId();
      const res = await request(app)
        .post(`/join-requests/${fakeId}/approve`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /join-requests/:id/decline', () => {
    let declineJoinRequestId = '';
    beforeEach(async () => {
      // Create another join request to decline
      const res = await request(app)
        .post('/join-requests')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({tripId: tripId_2});
      declineJoinRequestId = res.body._id;
    });

    test('declines a join request', async () => {
      const res = await request(app)
        .post(`/join-requests/${declineJoinRequestId}/decline`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.isActive).toBe(false);
    });

    test('fails if join request not found', async () => {
      const fakeId = new Types.ObjectId();
      const res = await request(app)
        .post(`/join-requests/${fakeId}/decline`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(res.status).toBe(404);
    });
  });
});
