import {Request, Response} from 'express';
import {BaseController} from '@controllers/baseController';
import {StatusCodes} from 'http-status-codes';
import {sendError} from '@utils/sendError';
import {Chat, IChats} from '@models/chatModel';
import {Message} from '@models/messageModel';
import {getIO} from '@utils/socket';

class ChatsController extends BaseController<IChats> {
  constructor() {
    super(Chat);
  }

  async createChat(request: Request, response: Response): Promise<void> {
    try {
      const {participantsIds, createdAt} = request.body;

      if (!Array.isArray(participantsIds) || participantsIds.length === 0) {
        return sendError(response, StatusCodes.BAD_REQUEST, 'Missing or invalid required fields');
      }

      // Ensure all participant IDs are valid ObjectIds and are on the same trip

      const newChat = new Chat({
        participantsIds,
        createdAt,
      });

      const createdChat = await newChat.save();

      response.status(StatusCodes.CREATED).json(createdChat);
    } catch (error) {
      return sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create the chat', JSON.stringify(error));
    }
  }

  async getChatByUserId(request: Request, response: Response) {
    try {
      const userId = request.params.userId;
      const chats = await Chat.find({participantsIds: userId}).populate('participantsIds', 'userName profileImageUrl');

      if (!chats || chats.length === 0) {
        return sendError(response, StatusCodes.NOT_FOUND, `No chats found for user with id ${userId}`);
      }

      response.status(StatusCodes.OK).json(chats);
    } catch (error) {
      return sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed fetching chats by user id',
        JSON.stringify(error)
      );
    }
  }

  async sendMessage(request: Request, response: Response): Promise<void> {
    try {
      const {chatId, senderId, content, timestamp} = request.body;

      if (!chatId || !senderId || !content) {
        return sendError(response, StatusCodes.BAD_REQUEST, 'Missing or invalid required fields');
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return sendError(response, StatusCodes.NOT_FOUND, `Chat with id ${chatId} was not found`);
      }
      const newMessage = new Message({
        chatId: chatId,
        senderId: senderId,
        content: content,
        timestamp: timestamp,
      });

      const createdMessage = await newMessage.save();

      getIO().to(chatId.toString()).emit('newMessage', createdMessage);

      response.status(StatusCodes.CREATED).json(createdMessage);
    } catch (error) {
      return sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to save the message',
        JSON.stringify(error)
      );
    }
  }

  async getMessagesByChatId(request: Request, response: Response) {
    try {
      const chatId = request.params.id;
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return sendError(response, StatusCodes.NOT_FOUND, `Chat with id ${chatId} was not found`);
      }

      const messages = await Message.find({chatId: chatId}).sort('timestamp');

      response.status(StatusCodes.OK).json(messages);
    } catch (error) {
      sendError(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed fetching messages by chat id',
        JSON.stringify(error)
      );
    }
  }
}

export default new ChatsController();
