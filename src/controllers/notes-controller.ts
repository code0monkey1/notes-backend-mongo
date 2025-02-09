import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/tokenParser";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { validationErrorParser } from "../utils/helper";
import NoteService from "../services/NoteService";
import { NoteType } from "../models/types";
import UserService from "../services/UserService";

export class NotesController {
    constructor(
        private readonly noteService: NoteService,
        private readonly userService: UserService,
    ) {}

    getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notes = await this.noteService.getAllNotes();

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

            const savedUser = await this.userService.getUserById(req.user.id);

            const body = req.body as Partial<NoteType>;

            const noteBody = {
                content: body.content as string,
                user: savedUser._id,
                important: body.important || false,
            };

            const newNote = await this.noteService.createNote(noteBody);

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

            const updatedNote = await this.noteService.updateNote(
                req.params.id,
                modifiedNote,
            );

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
            if (!(req.note && req.note.user)) {
                throw createHttpError(
                    400,
                    "note object not attached to custom request object",
                );
            }

            if (req.note.user.toString() !== req.user?.id) {
                throw createHttpError(401, "unauthorized user");
            }

            await this.noteService.deleteNote(req.params.id);

            res.json();
        } catch (err) {
            next(err);
        }
    };
}
