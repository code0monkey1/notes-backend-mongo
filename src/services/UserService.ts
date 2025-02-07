import { RegisterUserType, UserType } from "../models/types";
import User from "../models/user.model";

export class UserService {
    async findUserByEmail(email: string) {
        const existingUser = await User.findOne({ email });
        return existingUser;
    }

    async findByIdAndDelete(id: string) {
        await User.findByIdAndDelete(id);
    }

    async updateUserById(userId: string, user: RegisterUserType) {
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

        return foundUser;
    }

    async getUserById(userId: string) {
        const user = await User.findById(userId);

        return user;
    }
}
