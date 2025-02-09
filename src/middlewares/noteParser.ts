import { Response, NextFunction } from "express";
import { CustomRequest } from "./tokenParser";
import createHttpError from "http-errors";
import Note from "../models/note.model";
import mongoose from "mongoose";

const noteParser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const noteId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            throw createHttpError(400, "Notes id is invalid mongooseId");
        }

        const note = await Note.findById(noteId);

        if (!note) {
            throw createHttpError(404, "note not found");
        }

        req.note = note;
        next();
    } catch (err) {
        next(err);
    }
};

export default noteParser;
