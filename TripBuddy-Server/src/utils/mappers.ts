import {UserResponse} from '@customTypes/UserResponse';
import {IUser} from '@models/usersModel';

const userToUserResponse = (user: IUser): UserResponse => ({
  _id: user._id.toString(),
  userName: user.userName,
  profileImageUrl: user.profileImageUrl,
  description: user.description,
  age: user.age,
  gender: user.gender,
  religion: user.religion,
  diet: user.diet,
});

export {userToUserResponse};
