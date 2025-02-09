import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import db from "../../src/utils/db";
import helper, { assertErrorMessageExists } from "../auth/helper";
import { TokenService } from "../../src/services/TokenService";
import Note from "../../src/models/note.model";

describe("GET /notes/:id", () => {
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
        it("should return status 200 and get the note given the id", async () => {
            const user = await helper.createUser(helper.getUserData());
            const token = TokenService.generateToken({ id: user._id });

            const note = await Note.create({
                content: "This is a test note",
                user: user._id,
                important: false,
            });

            const res = await request(app)
                .get(`/notes/${note._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body.content).toEqual(note.content);
            expect(res.body.important).toEqual(note.important);
            expect(res.body.user).toEqual(user._id.toString());
        });
    });

    describe("unhappy path", () => {
        it("should return 401 status code when bearer token not provided", async () => {
            const res = await request(app).get("/notes/1").expect(401);

            await assertErrorMessageExists(res, "No token provided");
        });

        it("should return 401 status code when invalid notes mongoose id is provided", async () => {
            const user = await helper.createUser(helper.getUserData());
            const token = TokenService.generateToken({ id: user._id });

            const res = await request(app)
                .get(`/notes/abc123`)
                .set("Authorization", `Bearer ${token}`)
                .expect(400);

            await assertErrorMessageExists(
                res,
                "Notes id is invalid mongooseId",
            );
        });

        it("should return 404 status code when note with given id does not exist", async () => {
            const user = await helper.createUser(helper.getUserData());
            const token = TokenService.generateToken({ id: user._id });

            const note = await Note.create({
                content: "This is a test note",
                user: user._id,
                important: false,
            });

            await Note.findOneAndDelete(note.id);

            const res = await request(app)
                .get(`/notes/${note._id}`)
                .set("Authorization", `Bearer ${token}`);

            await assertErrorMessageExists(res, "note not found");
        });
    });
});
