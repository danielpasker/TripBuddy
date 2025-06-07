import {model, Schema, Types} from 'mongoose';

interface IChats {
  participantsIds: Types.ObjectId[];
  createdAt: Date;
}

const chatSchema = new Schema<IChats>({
  participantsIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Users',
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = model('Chats', chatSchema);

export type {IChats};
export {Chat};
