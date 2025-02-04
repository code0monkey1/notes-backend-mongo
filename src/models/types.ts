export type UserType = {
  name: string;
  email: string;
  hashedPassword: string;
  username: string;
};

export type RegisterUserType = Omit<UserType, "hashedPassword"> & {
  password: string;
};
