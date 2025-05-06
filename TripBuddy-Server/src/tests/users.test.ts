import request from 'supertest';
import {Express} from 'express';
import mongoose, {Types} from 'mongoose';
import {initApp} from '../server';
import {prepareUserForTests} from './prepareTests';

let app: Express;
let userAccessToken = '';
let userId = '';

beforeAll(async () => {
  app = await initApp();
  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;
});

afterAll(done => {
  mongoose.connection.close();
  done();
});

describe('UsersController', () => {
  describe('getUserById', () => {
    test('returns user data when user is found', async () => {
      const response = await request(app).get(`/users/${userId}`).set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', userId);
      expect(response.body).toHaveProperty('userName');
      expect(response.body).toHaveProperty('profileImageUrl');
    });

    test('returns 404 when user is not found', async () => {
      const response = await request(app)
        .get(`/users/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    test('returns 500 on error', async () => {
      const response = await request(app).get('/users/invalid_id').set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe('getUserTrips', () => {
    test('returns trips for a valid user', async () => {
      const response = await request(app)
        .get(`/users/${userId}/trips`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('returns 404 for a non-existent user', async () => {
      const response = await request(app)
        .get(`/users/${new Types.ObjectId()}/trips`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Trips not found');
    });
  });

  describe('updateProfileImage', () => {
    test('updates profile image and returns updated user', async () => {
      const response = await request(app)
        .put('/users/profile-picture')
        .send({userId, imageUrl: 'new-url'})
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('profileImageUrl', 'new-url');
    });
  });

  describe('updateUserDescription', () => {
    test('updates user description and returns updated user', async () => {
      const response = await request(app)
        .put('/users/description')
        .send({
          userId,
          description: 'Avid traveler and photographer.',
        })
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('description', 'Avid traveler and photographer.');
    });
  });
});
