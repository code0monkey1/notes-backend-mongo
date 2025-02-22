import createHttpError from "http-errors";
import { RegisterUserType, UserType } from "../models/types";
import User from "../models/user.model";
import { Types } from "mongoose";
export default class UserService {
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

        if (!updatedUser) {
            throw createHttpError(404, "User not found");
        }

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

        if (!user) {
            throw createHttpError(404, "user not found");
        }

        return user;
    }

    async addNoteToUser(userId: Types.ObjectId, noteId: Types.ObjectId) {
        await User.findByIdAndUpdate(
            userId,
            { $push: { notes: noteId } },
            { new: true },
        );
    }
}
