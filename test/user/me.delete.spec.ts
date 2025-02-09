import request from "supertest";
import app from "../../src/app"; // Adjust the path to your app
import helper from "../auth/helper";
import db from "../../src/utils/db";
import { TokenService } from "../../src/services/TokenService";

const BASE_URL = "/user/me";
describe("DELETE /user/me", () => {
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

    it("should delete user ", async () => {
        //arrange

        // First create a user
        const user = await helper.createUser(helper.getUserData());

        const jwt = TokenService.generateToken({
            id: user.id,
            email: user.email,
        });
        //act

        expect((await helper.getAllUsers()).length).toBe(1);

        const response = await request(app)
            .delete(BASE_URL)
            .set("Authorization", `Bearer ${jwt}`)
            .expect(200);

        //assert
        expect((await helper.getAllUsers()).length).toBe(0);
    });

    it("should return 404 if user to delete not found", async () => {
        // First create a user
        const deletedUser = await helper.getDeletedUser(helper.getUserData());

        const jwt = TokenService.generateToken({
            id: deletedUser.id,
            email: deletedUser.email,
        });

        //act
        await request(app)
            .delete(BASE_URL)
            .set("Authorization", `Bearer ${jwt}`)
            .expect(404);
    });
});
