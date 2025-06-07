import {model, Schema, Types} from 'mongoose';

interface IMessages {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  timestamp: Date;
  readBy: Types.ObjectId[];
}

const messageSchema = new Schema<IMessages>({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readBy: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

const Message = model('Messages', messageSchema);

export type {IMessages};
export {Message};
