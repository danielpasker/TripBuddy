import {model, Schema} from 'mongoose';

interface IUser {
  _id: string;
  email: string;
  password: string;
  userName: string;
  profileImageUrl: string | null;
  refreshToken?: string[];
  description: string | null;
  gender: string | null;
  age: number | null;
  religion: string | null;
  diet: string[] | null;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  profileImageUrl: String,
  refreshToken: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  religion: {
    type: String,
    default: null,
  },
  diet: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    default: null,
  },
});

const userModel = model<IUser>('Users', userSchema);

export type {IUser};
export {userModel};
