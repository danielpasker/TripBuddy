import {Response} from 'express';
import {BaseController} from '@controllers/baseController';
import {StatusCodes} from 'http-status-codes';
import {sendError} from '@utils/sendError';
import {Chat, IChats} from '@models/chatModel';
import {Message} from '@models/messageModel';
import {RequestWithUserId} from '@customTypes/request';

class ChatsController extends BaseController<IChats> {
  constructor() {
    super(Chat);
  }

  async createOrGetChat(request: RequestWithUserId, response: Response): Promise<void> {
    try {
      if (!request.userId) {
        return sendError(response, StatusCodes.UNAUTHORIZED, 'User ID is required');
      }
      let {participantsIds = []} = request.body as {participantsIds: string[]};

      if (!participantsIds.includes(request.userId)) participantsIds.push(request.userId);

      participantsIds = [...new Set(participantsIds)];

      if (participantsIds.length < 2)
        return sendError(response, StatusCodes.BAD_REQUEST, 'At least two participants are required');

      let chat = await Chat.findOne({
        participantsIds: {$all: participantsIds, $size: participantsIds.length},
      });

      if (!chat) chat = await Chat.create({participantsIds});

      const messages = await Message.find({chatId: chat._id}).sort({timestamp: 1});

      response.status(StatusCodes.OK).json({chat, messages});
    } catch (error) {
      return sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create or get chat',
        JSON.stringify(error)
      );
    }
  }

  async getChatById(request: RequestWithUserId, response: Response): Promise<void> {
    try {
      if (!request.userId) {
        return sendError(response, StatusCodes.UNAUTHORIZED, 'User ID is required');
      }
      const {chatId} = request.params;

      const chat = await Chat.findById(chatId);
      if (!chat) return sendError(response, StatusCodes.NOT_FOUND, `Chat with id ${chatId} was not found`);

      if (!chat.participantsIds.some(id => id.equals(request.userId)))
        return sendError(response, StatusCodes.FORBIDDEN, 'You are not a participant of this chat');

      const messages = await Message.find({chatId}).sort({timestamp: 1});
      response.status(StatusCodes.OK).json({chat, messages});
    } catch (error) {
      return sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to fetch chat by ID',
        JSON.stringify(error)
      );
    }
  }

  async sendMessage(request: RequestWithUserId, response: Response): Promise<void> {
    try {
      if (!request.userId) {
        return sendError(response, StatusCodes.UNAUTHORIZED, 'User ID is required');
      }
      const {chatId} = request.params;
      const {content, timestamp} = request.body;

      if (!chatId || !content) {
        return sendError(response, StatusCodes.BAD_REQUEST, 'Missing or invalid required fields');
      }

      const chat = await Chat.findById(chatId);
      if (!chat) return sendError(response, StatusCodes.NOT_FOUND, `Chat with id ${chatId} was not found`);

      if (!chat.participantsIds.some(id => id.equals(request.userId)))
        return sendError(response, StatusCodes.FORBIDDEN, 'You are not a participant of this chat');

      const message = await Message.create({chatId, senderId: request.userId, content, timestamp});
      response.status(StatusCodes.CREATED).json(message);
    } catch (error) {
      return sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to save the message',
        JSON.stringify(error)
      );
    }
  }
}

export default new ChatsController();
