import {User} from '@customTypes/User';

interface JoinRequestPreview {
  _id: string;
  user: User;
  approvingUsers: User[];
}

export type {JoinRequestPreview};
