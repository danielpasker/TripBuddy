import request from 'supertest';
import {initApp} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {Chat} from '../models/chatModel';
import {Message} from '../models/messageModel';
import {prepareAnotherUserForTests} from './prepareTests';

let app: Express;
let userA: {_id: string; accessToken: string};
let userB: {_id: string; accessToken: string};
let chatId = '';

beforeAll(async () => {
  app = await initApp();

  await Chat.deleteMany();
  await Message.deleteMany();

  userA = await prepareAnotherUserForTests(app, 'testUserA@example.com', 'password123', 'asdasdas');
  userB = await prepareAnotherUserForTests(app, 'testUserB@example.com', 'password123', 'asdasdas');

  console.log('User A:', userA);
  console.log('User B:', userB);
  const res = await request(app)
    .post('/chats')
    .set('Authorization', `Bearer ${userA.accessToken}`)
    .send({participantsIds: [userB._id]});

  chatId = res.body.chat._id;
});

afterAll(done => {
  mongoose.connection.close();
  done();
});

describe('Chat Controller e2e', () => {
  test('createOrGetChat returns existing chat', async () => {
    const res = await request(app)
      .post('/chats')
      .set('Authorization', `Bearer ${userA.accessToken}`)
      .send({participantsIds: [userB._id]});

    expect(res.statusCode).toBe(200);
    expect(res.body.chat._id).toBe(chatId);
    expect(res.body.messages).toHaveLength(0);
  });

  test('fail create chat with <2 participants', async () => {
    const res = await request(app)
      .post('/chats')
      .set('Authorization', `Bearer ${userA.accessToken}`)
      .send({participantsIds: []});

    expect(res.statusCode).toBe(400);
  });

  let messageId = '';
  test('sendMessage stores and returns 201', async () => {
    const res = await request(app)
      .post(`/chats/${chatId}/messages`)
      .set('Authorization', `Bearer ${userA.accessToken}`)
      .send({content: 'Hello B!', timestamp: new Date().toISOString()});

    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe('Hello B!');
    expect(res.body.chatId).toBe(chatId);
    expect(res.body.senderId).toBe(userA._id);

    messageId = res.body._id;
  });

  test('Stranger cannot post message to chat he is not in', async () => {
    const stranger = await prepareAnotherUserForTests(app, 'stranger@example.com', 'password123', 'asdasdas');

    const res = await request(app)
      .post(`/chats/${chatId}/messages`)
      .set('Authorization', `Bearer ${stranger.accessToken}`)
      .send({content: 'spam', timestamp: new Date().toISOString()});

    expect(res.statusCode).toBe(403);
  });

  test('getChatById returns chat and message', async () => {
    const res = await request(app).get(`/chats/${chatId}`).set('Authorization', `Bearer ${userB.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.chat._id).toBe(chatId);
    expect(res.body.messages).toHaveLength(1);
    expect(res.body.messages[0]._id).toBe(messageId);
  });

  test('getChatById forbidden for non-participant', async () => {
    const stranger = await prepareAnotherUserForTests(app, 'stranger@example.com', 'password123', 'asdasdas');

    const res = await request(app).get(`/chats/${chatId}`).set('Authorization', `Bearer ${stranger.accessToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('create chat without token → 401', async () => {
    const res = await request(app)
      .post('/chats')
      .send({
        participantsIds: [userB._id],
      });
    expect(res.statusCode).toBe(401);
  });
});
