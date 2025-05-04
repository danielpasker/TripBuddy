interface User {
  _id: string;
  userName: string;
  profileImageUrl: string | null;
  description: string | null;
  gender: string | null;
  age: number | null;
  religion: string | null;
  diet: string | null;
}

interface LoggedUser extends User {
  accessToken: string;
  refreshToken: string;
}

export type {User, LoggedUser};
