import {userModel} from '../models/usersModel';
import request from 'supertest';
import {Express} from 'express';

const testUserDetails = {
  email: 'testuser@example.com',
  password: 'password123',
  profileImageUrl: 'asdasdas',
};

const prepareUserForTests = async (app: Express) => {
  await userModel.deleteOne({userName: 'testuser'});
  await request(app).post('/auth/register').send(testUserDetails);

  const loginResponse = await request(app).post('/auth/login').send(testUserDetails);

  return loginResponse.body;
};

const prepareAnotherUserForTests = async (app: Express, email: string, password: string, profileImageUrl: string) => {
  const testUser = {email, password, profileImageUrl};
  await userModel.deleteOne({email: email});
  await request(app).post('/auth/register').send(testUser);

  const loginResponse = await request(app).post('/auth/login').send(testUser);

  return loginResponse.body;
};

export {prepareUserForTests, prepareAnotherUserForTests, testUserDetails};
