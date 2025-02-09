/* eslint-disable @typescript-eslint/no-misused-promises */
import { NextFunction, Response, Router } from "express";
import tokenParser, { CustomRequest } from "../middlewares/tokenParser";
import noteValidator from "../validators/note-validator";
import { validationResult } from "express-validator";
import { validationErrorParser } from "../utils/helper";
import Note, { NoteType } from "../models/note.model";
import createHttpError from "http-errors";
import User from "../models/user.model";
import mongoose from "mongoose";

const router = Router();

router.post(
    "/",
    tokenParser,
    noteValidator,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).json(validationErrorParser(result));
            }

            if (!(req.user && req.user.id)) {
                throw createHttpError(
                    400,
                    "user details missing in request object",
                );
            }

            const userId = req.user.id;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw createHttpError(400, "Invalid user id");
            }

            const savedUser = await User.findById(userId);

            if (!savedUser) {
                throw createHttpError(404, "User not found");
            }

            const body = req.body as Partial<NoteType>;

            const noteBody = {
                content: body.content as string,
                user: userId,
                important: body.important,
            };

            const newNote = await Note.create(noteBody);

            res.status(201).json(newNote);
        } catch (err) {
            next(err);
        }
    },
);

export default router;
