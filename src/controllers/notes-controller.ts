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

            // Add the new note's ObjectId to the user's notes array
            await this.userService.addNoteToUser(savedUser._id, newNote._id!);

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
            const updatedNote = await this.noteService.updateNote(
                req.params.id,
                req.body as Partial<NoteType>,
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
            await this.noteService.deleteNoteById(req.params.id);

            res.json();
        } catch (err) {
            next(err);
        }
    };
}
