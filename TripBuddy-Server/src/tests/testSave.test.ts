// import { prepareUserForTests, testUserDetails } from './prepTest';  // Import your test user setup
// import request from 'supertest';import mongoose from 'mongoose';
// import { StatusCodes } from 'http-status-codes';
// import Trip from '@models/tripModel';  // Your trip model

// import { Express } from 'express';

// let app: Express;

// describe('POST /api/trip-plans/save', () => {
//   let authToken: string;

//   beforeAll(async () => {
//     // Prepare the user for authentication
//     const loginResponse = await prepareUserForTests(app);
//     authToken = loginResponse.token;  // Assume loginResponse includes a token
//   });

//   afterEach(async () => {
//     // Clean up database after each test (Optional)
//     await Trip.deleteMany({});
//   });

//   it('should save the trip plan successfully', async () => {
//     // Mock data for the trip plan
//     const tripPlanData = {
//       startDate: '2025-05-01',
//       endDate: '2025-05-10',
//       users: ['user1', 'user2'],
//       plan: [
//         {
//           location: 'Paris',
//           countryCode: 'FR',
//           days: 5,
//           budget: '2000 EUR',
//           participants: 4,
//           plan: [],
//         },
//       ],
//     };

//     // Send request to save the trip plan
//     const response = await request(app)
//       .post('/trip-plans/save')
//       .set('Authorization', `Bearer ${authToken}`) // Pass the token as Authorization header
//       .send(tripPlanData);

//     // Assertions
//     expect(response.status).toBe(StatusCodes.CREATED);
//     expect(response.body).toHaveProperty('_id');  // Ensure the response has the _id (MongoDB ID)
//     expect(response.body.startDate).toBe('2025-05-01');
//     expect(response.body.endDate).toBe('2025-05-10');
//     expect(response.body.users).toEqual(['user1', 'user2']);
//     expect(response.body.plan[0].location).toBe('Paris');

//     // Verify that the trip is saved in the database
//     const savedTrip = await Trip.findById(response.body._id);
//     expect(savedTrip).not.toBeNull();
//     expect(savedTrip?.startDate).toBe('2025-05-01');
//     expect(savedTrip?.endDate).toBe('2025-05-10');
//     expect(savedTrip?.users).toEqual(['user1', 'user2']);
//     expect(savedTrip?.plan[0].location).toBe('Paris');
//   });

//   it('should return an error if required fields are missing', async () => {
//     const incompleteData = {
//       startDate: '2025-05-01',
//       endDate: '2025-05-10',
//       // Missing 'plan' field here to simulate an error
//       users: ['user1', 'user2'],
//     };

//     const response = await request(app)
//       .post('/trip-plans/save')
//       .set('Authorization', `Bearer ${authToken}`)
//       .send(incompleteData);

//     expect(response.status).toBe(StatusCodes.BAD_REQUEST);
//     expect(response.body.error).toBe('Missing required fields');
//   });
// });
