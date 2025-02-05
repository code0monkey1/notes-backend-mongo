import mongoose, { Schema } from "mongoose";
import { UserType } from "./types";

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model<UserType>("User", UserSchema);

// remove the __v and change the _id to a string in the toJSon of the user
UserSchema.set("toJSON", {
    transform: (document, ret) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
    },
});

export default User;
