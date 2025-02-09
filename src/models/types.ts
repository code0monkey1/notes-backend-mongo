import { Types } from "mongoose";

export type UserType = {
    name: string;
    email: string;
    hashedPassword: string;
    username: string;
};

export type RegisterUserType = Omit<UserType, "hashedPassword"> & {
    password: string;
};

export type LoginUserType = {
    email: string;
    password: string;
};

export type NoteType = {
    content: string;
    user: Types.ObjectId;
    important: boolean;
};
