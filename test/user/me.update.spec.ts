import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import helper, { assertErrorMessageExists } from "../auth/helper";
import db from "../../src/utils/db";
import { TokenService } from "../../src/services/TokenService";

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

    it("should return 401 if no token is provided", async () => {
        const response = await request(app)
            .patch(BASE_URL)
            .send({
                name: "New Name",
                email: "email@gmail.com",
            })
            .expect(401);

        await assertErrorMessageExists(response, "No token provided");
    });

    it("should return 404 if user does not exist", async () => {
        const jwt = TokenService.generateToken({
            id: "60a8e9b6b8d5f20015b4d7c6",
            email: "email@gmail.com",
        });

        const response = await request(app)
            .patch(BASE_URL)
            .set("Authorization", `Bearer ${jwt}`)
            .send({
                name: "New Name",
                email: "newemail@example.com",
            })
            .expect(404);

        await assertErrorMessageExists(response, "User not found");
    });
});
