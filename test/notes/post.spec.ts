import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import db from "../../src/utils/db";
import helper, { assertErrorMessageExists } from "../auth/helper";
import { TokenService } from "../../src/services/TokenService";

describe("POST /notes", () => {
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
        it("should return 201 and create a new note with user id equal to the token user id", async () => {
            const user = await helper.createUser(helper.getUserData());
            const token = TokenService.generateToken({ id: user._id });

            const note = {
                content: "This is a test note",
                important: true,
            };

            const res = await request(app)
                .post("/notes")
                .set("Authorization", `Bearer ${token}`)
                .send(note)
                .expect(201);

            //assert
            expect(res.body).toHaveProperty("content", note.content);
            expect(res.body.user).toEqual(user._id.toString());
            expect(res.body.important).toBe(note.important);
        });
    });

    describe("unhappy path", () => {
        it("should return 401 status code when user is not authenticated", async () => {
            const res = await request(app)
                .post("/notes")
                .send({
                    title: "Test Note",
                    content: "This is a test note",
                })
                .expect(401);

            await assertErrorMessageExists(res, "No token provided");
        });
        it("should return 400 status code when content is not provided", async () => {
            const user = await helper.createUser(helper.getUserData());
            const token = TokenService.generateToken({ id: user._id });
            const res = await request(app)
                .post("/notes")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Test Note" })
                .expect(400);

            await assertErrorMessageExists(res, "content is missing");
        });

        it("should return 404 status code when user is not found", async () => {
            const deletedUser = await helper.getDeletedUser(
                helper.getUserData(),
            );
            const token = TokenService.generateToken({ id: deletedUser._id });
            const res = await request(app)
                .post("/notes")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Test Note", content: "This is a test note" })
                .expect(404);

            await assertErrorMessageExists(res, "user not found");
        });

        it("should return 400 status code when user is invalid", async () => {
            const token = TokenService.generateToken({ id: "invalid-id" });
            const res = await request(app)
                .post("/notes")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Test Note", content: "This is a test note" })
                .expect(400);

            await assertErrorMessageExists(res, "Invalid user id");
        });
    });
});
