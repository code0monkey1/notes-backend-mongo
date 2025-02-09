import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import db from "../../src/utils/db";
import helper, { assertErrorMessageExists } from "../auth/helper";
import { TokenService } from "../../src/services/TokenService";
import Note from "../../src/models/note.model";

describe("GET /notes", () => {
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
        it("should return 200 and get all the notes", async () => {
            const user = await helper.createUser(helper.getUserData());

            const token = TokenService.generateToken({
                id: user._id,
                email: user.email,
            });

            //create 2 notes
            await Note.create({
                content: "Test note 1",
                user: user._id.toString(),
                important: true,
            });

            await Note.create({
                content: "Test note 2",
                user: user._id.toString(),
                important: false,
            });

            const res = await request(app)
                .get("/notes")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body).toHaveLength(2);
            expect(res.body[0].content).toBe("Test note 1");
            expect(res.body[1].content).toBe("Test note 2");
        });
    });

    describe("unhappy path", () => {
        it("should return 401 status code when bearer token not provided", async () => {
            const res = await request(app).get("/notes").expect(401);
            await assertErrorMessageExists(res, "No token provided");
        });
    });
});
