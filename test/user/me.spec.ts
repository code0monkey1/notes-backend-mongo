import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import helper from "../auth/helper";
import { TokenService } from "../../src/services/TokenService";
import db from "../../src/utils/db";

const BASE_URL = "/user/me";
describe("PATCH /user/me", () => {
    beforeAll(async () => {
        await db.connect();
    });

    beforeEach(async () => {
        // delete all users created
        await db.clear();
    });

    afterAll(async () => {
        // disconnect db
        await db.disconnect();
    });

    it("should update user details", async () => {
        // First create a user
        const user = await helper.createUser(helper.getUserData());

        const jwt = TokenService.generateToken({
            id: user.id,
            email: user.email,
        });

        const response = await request(app)
            .patch(BASE_URL)
            .set("Authorization", `Bearer ${jwt}`)
            .send({
                name: "New Name",
                email: "newemail@example.com",
            })
            .expect(200);

        expect(response.body).toHaveProperty("name", "New Name");
        expect(response.body).toHaveProperty("email", "newemail@example.com");
    });

    it("should return 401 if user does not exist", async () => {
        const response = await request(app).patch(BASE_URL).send({
            name: "New Name",
            email: "newemail@example.com",
        });

        expect(response.status).toBe(401);
    });
});
