import { NextFunction, Request, Response } from "express";
import Note, { NoteType } from "../models/note.model";
import { CustomRequest } from "../middlewares/tokenParser";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import User from "../models/user.model";
import { validationErrorParser } from "../utils/helper";
import mongoose from "mongoose";

export class NotesController {
    constructor() {}

    getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notes = await Note.find({});

            res.json(notes);
        } catch (e) {
            next(e);
        }
    };

    getNoteById = (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const note = req.note;

            res.json(note);
        } catch (e) {
            next(e);
        }
    };

    createNote = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ) => {
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
    };
    updateNoteById = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const modifiedNote = req.body as Partial<NoteType>;

            if (!(req.note && req.note.user)) {
                throw createHttpError(
                    400,
                    "note object not attached to custom request object",
                );
            }

            if (req.note.user.toString() != req.user?.id) {
                throw createHttpError(401, "unauthorized user");
            }

            const updatedNote = await Note.findByIdAndUpdate(
                req.params.id,
                modifiedNote,
                {
                    new: true,
                },
            );

            if (!updatedNote) {
                return res.status(404).json({ message: "Note not found" });
            }

            res.json(updatedNote);
        } catch (error) {
            next(error);
        }
    };

    deleteNoteById = async (
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

            if (note.user.toString() !== req.user?.id) {
                throw createHttpError(401, "unauthorized user");
            }

            await Note.findByIdAndDelete(noteId);

            res.json();
        } catch (err) {
            next(err);
        }
    };
}
