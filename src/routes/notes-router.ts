/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import tokenParser from "../middlewares/tokenParser";
import noteValidator from "../validators/note-validator";

import noteParser from "../middlewares/noteParser";
import { NotesController } from "../controllers/notes-controller";

const router = Router();
const notesController = new NotesController();

router.use(tokenParser);

router.get("/", notesController.getAllNotes);

router.get("/:id", noteParser, notesController.getNoteById);

router.post("/", noteValidator, notesController.createNote);

router.patch("/:id", noteParser, notesController.updateNoteById);

router.delete("/:id", notesController.deleteNoteById);

export default router;
