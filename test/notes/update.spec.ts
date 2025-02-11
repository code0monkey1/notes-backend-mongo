import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import db from "../../src/utils/db";
import helper, { assertErrorMessageExists } from "../auth/helper";
import Note from "../../src/models/note.model";
import { TokenService } from "../../src/services/TokenService";

describe("PATCH /notes", () => {
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
        it("should return 200 with the updated note object", async () => {
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

            const res = await request(app)
                .patch(`/notes/${note._id}`)
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content" });

            expect(res.body.content).toBe("Updated note content");
            expect(res.body.important).toBe(true);
            expect(res.body.user).toBe(user._id.toString());
        });
    });

    describe("unhappy path", () => {
        it("should return 401 status code when bearer token not provided", async () => {
            const res = await request(app)
                .patch("/notes/123")
                .send({ content: "Updated note content" })
                .expect(401);
            await assertErrorMessageExists(res, "No token provided");
        });

        it("should return 404 if note to be updated is not found", async () => {
            const user = await helper.createUser(helper.getUserData());

            const token = TokenService.generateToken({
                id: user._id,
                email: user.email,
            });

            const res = await request(app)
                .patch("/notes/60a8e9b6b8d5f20015b4d7c6")
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content" })
                .expect(404);

            await assertErrorMessageExists(res, "note not found");
        });
        it("should return 400 status code when content is not provided", async () => {
            const user = await helper.createUser(helper.getUserData());
            const token = TokenService.generateToken({ id: user._id });

            const note = await helper.createNote(
                {
                    content: "This is a test note",
                },
                user._id,
            );

            const res = await request(app)
                .patch(`/notes/${note._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    content: "",
                });

            console.log(res.body);

            await assertErrorMessageExists(res, "content cannot be empty");
        });

        it("should return 400 status code when notes id is invalid", async () => {
            const user = await helper.createUser(helper.getUserData());

            const token = TokenService.generateToken({
                id: user._id,
                email: user.email,
            });

            const res = await request(app)
                .patch("/notes/invalid_id")
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content", note: "invalid_id" })
                .expect(400);

            await assertErrorMessageExists(
                res,
                "Notes id is invalid mongooseId",
            );
        });

        it("should return 401 status code when unauthorized usser tried to update notes", async () => {
            const user = await helper.createUser(helper.getUserData());

            const otherUser = await helper.getDeletedUser(helper.getUserData());

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
                .patch(`/notes/${note._id}`)
                .set("Authorization", "Bearer " + token)
                .send({ content: "Updated note content" })
                .expect(401);

            await assertErrorMessageExists(res, "unauthorized user");
        });
    });
});
