import { RegisterUserType, UserType } from "../models/types";
import User from "../models/user.model";

export class UserService {
    constructor() {}

    async findUserByEmail(email: string) {
        const existingUser = await User.findOne({ email });
        return existingUser;
    }

    async updateUser(userId: string, user: RegisterUserType) {
        const updatedUser = await User.findByIdAndUpdate(userId, user, {
            new: true,
        });

        return updatedUser;
    }

    async registerUser(user: UserType) {
        const newUser = await User.create(user);
        await newUser.save();
        return newUser;
    }

    async loginUser(userId: string) {
        const foundUser = await User.findById(userId);

        if (!foundUser) {
            throw new Error("User not found");
        }
        return foundUser;
    }

    async getUserById(userId: string) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
