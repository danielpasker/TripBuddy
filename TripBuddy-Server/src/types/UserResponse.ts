interface UserResponse {
  _id: string;
  userName: string;
  profileImageUrl: string | null;
  description: string | null;
  gender: string | null;
  age: number | null;
  religion: string | null;
  diet: string[] | null;
}

export type {UserResponse};
