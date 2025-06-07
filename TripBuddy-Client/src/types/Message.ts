export interface Message {
  _id?: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  readBy?: string[];
}
