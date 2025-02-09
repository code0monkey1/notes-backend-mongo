import mongoose, { Schema } from "mongoose";
import { NoteType } from "./types";

const NoteSchema: Schema = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: "User", // Assuming User is the name of your User model
        },
        important: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Note = mongoose.model<NoteType>("Note", NoteSchema);

// remove the __v and change the _id to a string in the toJSon of the user
NoteSchema.set("toJSON", {
    transform: (document, ret) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

export default Note;
