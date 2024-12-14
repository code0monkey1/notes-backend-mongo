import { UserType } from "../../src/models/types";
import User from "../../src/models/user.model";

export const getUserData = (): UserType => {
  return {
    name: "test",
    email: "test@gmail.com",
    password: "testing_right",
    username: "test",
  };
};

export const getAllUsers = async () => {
  const users = await User.find({});

  return users;
};

export const createUser = async (userData: UserType) => {
  const user = await User.create(userData);
};

export default {
  getUserData,
  getAllUsers,
  createUser,
};
