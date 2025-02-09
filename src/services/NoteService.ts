import createHttpError from "http-errors";
import Note from "../models/note.model";
import { NoteType } from "../models/types";

export default class NoteService {
    async createNote(noteBody: NoteType): Promise<NoteType> {
        const newNote = await Note.create(noteBody);
        return newNote;
    }

    async updateNote(id: string, noteBody: Partial<NoteType>) {
        const updatedNote = await Note.findByIdAndUpdate(id, noteBody, {
            new: true,
        });

        if (!updatedNote) {
            throw createHttpError(404, "note not found");
        }

        return updatedNote;
    }

    async getAllNotes() {
        const notes = await Note.find({});
        return notes;
    }

    async getNoteById(id: string) {
        const note = await Note.findById(id);

        if (!note) {
            throw createHttpError(404, "note not found");
        }
        return note;
    }

    async deleteNote(id: string) {
        await Note.findByIdAndDelete(id);
    }
}
