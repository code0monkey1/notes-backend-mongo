import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import db from "../../src/utils/db";
import helper, { assertErrorMessageExists } from "../auth/helper";
import { TokenService } from "../../src/routes/TokenService";
import Note from "../../src/models/note.model";

describe("DELETE /notes", () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    beforeEach(async () => {
        await db.clear();
    });

    describe("happy path", () => {
        it("should return 200 and delete the note ", async () => {
            const user = await helper.createUser(helper.getUserData());

            const token = TokenService.generateToken({
                id: user._id,
                email: user.email,
            });

            const note = await Note.create({
                content: "Test note",
                user: user._id.toString(),
                important: true,
            });

            const notesBefore = await Note.find({});

            await request(app)
                .delete(`/notes/${note._id}`)
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content" });

            const notesAfter = await Note.find({});

            expect(notesBefore.length).toBeGreaterThan(notesAfter.length);
            expect(notesAfter).not.toContainEqual(notesBefore[0]);
        });
    });

    describe("unhappy path", () => {
        it("should return 401 status code when bearer token not provided", async () => {
            const res = await request(app).delete("/notes/123").expect(401);
            await assertErrorMessageExists(res, "No token provided");
        });

        it("should return 404 if note to be deleted is not found", async () => {
            const user = await helper.createUser(helper.getUserData());

            const token = TokenService.generateToken({
                id: user._id,
                email: user.email,
            });

            const res = await request(app)
                .delete("/notes/60a8e9b6b8d5f20015b4d7c6")
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content" })
                .expect(404);

            await assertErrorMessageExists(res, "note not found");
        });

        it("should return 400 status code when notes id is invalid", async () => {
            const user = await helper.createUser(helper.getUserData());

            const token = TokenService.generateToken({
                id: user._id,
                email: user.email,
            });

            const res = await request(app)
                .delete("/notes/invalid_id")
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content", note: "invalid_id" })
                .expect(400);

            await assertErrorMessageExists(
                res,
                "Notes id is invalid mongooseId",
            );
        });

        it("should return 401 status code when unauthorized user tried to delete notes", async () => {
            const user = await helper.createUser(helper.getUserData());

            const otherUser = await helper.getDeletedUser({
                name: "otherName",
                username: "otherUser",
                email: "otherUser@example.com",
                password: "password",
            });

            const token = TokenService.generateToken({
                id: user._id,
                email: user.email,
            });

            const note = await Note.create({
                content: "This is a test note",
                important: true,
                user: otherUser._id,
            });

            const res = await request(app)
                .delete(`/notes/${note._id}`)
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content" })
                .expect(401);

            await assertErrorMessageExists(res, "unauthorized user");
        });
    });
});
