import {Chat} from '@customTypes/Chat';
import {Message} from '@customTypes/Message';
// import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

export const createOrGetChat = async (participantsIds: string[]) => {
  const response = await axiosInstance.post<{chat: Chat; messages: Message[]}>(`/chats`, {participantsIds});

  return response.data;
};

export const sendMessage = async (chatId: string, content: string) => {
  const timestamp = new Date().toISOString();
  const response = await axiosInstance.post<Message>(`/chats/${chatId}`, {
    content,
    timestamp,
  });

  return response.data;
};
