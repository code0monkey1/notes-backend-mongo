/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import tokenParser from "../middlewares/tokenParser";
import noteValidator from "../validators/note-validator";
import noteParser from "../middlewares/noteParser";
import { NotesController } from "../controllers/notes-controller";
import NoteService from "../services/NoteService";

const router = Router();
const noteService = new NoteService();
const notesController = new NotesController(noteService);

router.use(tokenParser);

router.get("/", notesController.getAllNotes);

router.get("/:id", noteParser, notesController.getNoteById);

router.post("/", noteValidator, notesController.createNote);

router.patch("/:id", noteParser, notesController.updateNoteById);

router.delete("/:id", noteParser, notesController.deleteNoteById);

export default router;
