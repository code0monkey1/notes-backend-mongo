import { Types } from "mongoose";
import Note from "../../src/models/note.model";
import { RegisterUserType, UserType } from "../../src/models/types";
import User from "../../src/models/user.model";
import bcrypt from "bcrypt";

export const getUserData = () => {
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

export const createUser = async (userData: any) => {
    const user = await User.create({
        name: userData.name,
        email: userData.email,
        username: userData.username,
        hashedPassword: await bcrypt.hash(userData.password, 10),
    });

    return user;
};

export const getDeletedUser = async (userData: any) => {
    const user = await createUser(userData);

    await User.deleteOne({ _id: user.id });

    return user;
};

export const assertErrorMessageExists = async (
    result: any,
    errorMessage: string,
) => {
    const errorMessages = result.body.errors.map((e: any) => e.message);

    // assert
    expect(errorMessages).toContainEqual(errorMessage);
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user as UserType;
};

export const createNote = async (noteData: any, userId: Types.ObjectId) => {
    const note = await Note.create({
        content: noteData.content,
        important: noteData.important,
        user: userId,
    });
    return note;
};

export default {
    getUserById,
    getUserData,
    getAllUsers,
    createUser,
    createNote,
    assertErrorMessageExists,
    getDeletedUser,
};
