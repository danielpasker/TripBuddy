// import request from 'supertest';
// import {beforeAll, afterAll, describe, it, expect} from '@jest/globals';
// import {initApp} from '../server';
// import mongoose from 'mongoose';
// import {Express} from 'express';
// import {Chat} from '../models/chatModel';
// import {Message} from '../models/messageModel';
// import {prepareUserForTests} from './prepareTests';

// let app: Express;
// let chatId = '';
// let userId = '';
// let otherUserId = '';
// let userAccessToken = '';

// beforeAll(async () => {
//   app = await initApp();

//   await Chat.deleteMany({});
//   await Message.deleteMany({});

//   const user = await prepareUserForTests(app);
//   userAccessToken = user.accessToken;
//   userId = user._id;

//   const otherUser = await prepareUserForTests(app);
//   otherUserId = otherUser._id;

//   const chatRes = await request(app)
//     .post('/chats')
//     .set('Authorization', `Bearer ${userAccessToken}`)
//     .send({participantsIds: [userId, otherUserId]});

//   chatId = chatRes.body._id;
// });

// afterAll(done => {
//   Message.deleteMany({chatId})
//     .then(() => Chat.deleteMany({participantsIds: userId}))
//     .then(() => mongoose.connection.close())
//     .then(() => done());
// });

// describe('Chats API', () => {
//   it('should create a new chat', async () => {
//     const res = await request(app)
//       .post('/chats')
//       .set('Authorization', `Bearer ${userAccessToken}`)
//       .send({participantsIds: [userId, otherUserId]});

//     expect(res.status).toBe(201);
//     expect(res.body.participants).toEqual(expect.arrayContaining([userId, otherUserId]));
//     expect(res.body.createdAt).toBeDefined();
//   });

//   it('should get chats for a user', async () => {
//     const res = await request(app).get(`/api/chats/${userId}`).set('Authorization', `Bearer ${userAccessToken}`);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body[0]._id).toBe(chatId);
//   });

//   it('should not create chat without auth', async () => {
//     const res = await request(app)
//       .post('/chats')
//       .send({participantsIds: [userId, otherUserId]});

//     expect(res.status).toBe(401);
//   });

//   it('should send a message', async () => {
//     const res = await request(app)
//       .post('/chats/messages')
//       .set('Authorization', `Bearer ${userAccessToken}`)
//       .send({chatId, senderId: userId, content: 'Hello there!'});

//     expect(res.status).toBe(201);
//     expect(res.body.content).toBe('Hello there!');
//     expect(res.body.chatId).toBe(chatId);
//     expect(res.body.senderId).toBe(userId);
//     expect(res.body.timestamp).toBeDefined();
//   });

//   it('should get messages by chat ID', async () => {
//     const res = await request(app).get(`/chats/messages/${chatId}`).set('Authorization', `Bearer ${userAccessToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.length).toBeGreaterThanOrEqual(1);
//     expect(res.body[0]).toHaveProperty('content', 'Hello there!');
//   });

//   it('should not send a message without auth', async () => {
//     const res = await request(app).post('chats/messages').send({chatId, senderId: userId, content: 'Unauthorized'});

//     expect(res.status).toBe(401);
//   });

//   it('should return 404 for chats of non-existent user', async () => {
//     const fakeUser = new mongoose.Types.ObjectId().toHexString();
//     const res = await request(app).get(`/chats/${fakeUser}`).set('Authorization', `Bearer ${userAccessToken}`);

//     expect(res.status).toBe(404);
//   });

//   it('should return 404 for messages of non-existent chat', async () => {
//     const fakeChat = new mongoose.Types.ObjectId().toHexString();
//     const res = await request(app).get(`/chats/messages/${fakeChat}`).set('Authorization', `Bearer ${userAccessToken}`);

//     expect(res.status).toBe(404);
//   });
// });
