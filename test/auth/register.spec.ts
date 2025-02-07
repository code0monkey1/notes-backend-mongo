import supertest from "supertest";
import app from "../../src/app";
import helper from "./helper";

import db from "../../src/utils/db";

const api = supertest(app);
const BASE_URL = "/auth/register";

describe("POST /auth/register", () => {
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

    describe("happy path", () => {
        it("should have the supplied body in request", async () => {
            const userData = helper.getUserData();

            const response = await api
                .post(BASE_URL)
                .send(userData)
                .expect(201);

            expect(response.body.email).toBe(userData.email);
            expect(response.body.name).toBe(userData.name);
            expect(response.body.username).toBe(userData.username);
        });

        it("should have hashedPassword attribute in response", async () => {
            const userData = helper.getUserData();

            const response = await api
                .post(BASE_URL)
                .send(userData)
                .expect(201);
            expect(response.body.hashedPassword).toBeDefined();
            expect(response.body.hashedPassword).not.toBe(userData.password);
        });

        it("shold return a JWT Bearer header token", async () => {
            const userData = helper.getUserData();

            const response = await api
                .post(BASE_URL)
                .send(userData)
                .expect(201);

            expect(response.headers.authorization).toBeDefined();
            expect(response.headers.authorization).toContain("Bearer");
        });
    });

    describe("unhappy path", () => {
        describe("when user already exists", () => {
            it("should return 409 status code, if email is duplicate", async () => {
                // arrange
                await helper.createUser(helper.getUserData());

                const usersBefore = await helper.getAllUsers();
                const userData = helper.getUserData();

                // act
                const response = await api
                    .post(BASE_URL)
                    .send(userData)
                    .expect(409);

                // assert
                helper.assertErrorMessageExists(
                    response,
                    "Email already registered",
                );

                const usersAfter = await helper.getAllUsers();
                expect(usersAfter.length).toBe(usersBefore.length);
            });
        });

        describe("validation errors", () => {
            it("shoud return response code 400 when no body is given", async () => {
                await api.post(BASE_URL).send({}).expect(400);
            });
            it("should return 400 status code if password is less than 8 chars exists", async () => {
                //arrange
                const userData = helper.getUserData();

                //act
                const result = await api
                    .post(BASE_URL)
                    .send({ ...userData, password: "1234567" })
                    .expect(400);

                // assert
                helper.assertErrorMessageExists(
                    result,
                    "Password must be at least 8 characters long",
                );
            });

            it("should return 400 status code if email is invalid", async () => {
                //arrange

                const userData = helper.getUserData();
                //act

                const result = await api
                    .post(BASE_URL)
                    .send({ ...userData, email: "invalid_email" })
                    .expect(400);

                // assert
                helper.assertErrorMessageExists(
                    result,
                    "Email should be valid",
                );
            });

            it("should return 400 status code if email is missing", async () => {
                //arrange
                const userData = helper.getUserData();

                //act
                const result = await api
                    .post(BASE_URL)
                    .send({ ...userData, email: "" })
                    .expect(400);

                // assert
                helper.assertErrorMessageExists(result, "email is missing");
            });
        });
    });
});
