import supertest from "supertest";
import app from "../../src/app";
import db from "../../src/utils/db";
import helper from "./helper";
import { assertErrorMessageExists } from "./helper";

const api = supertest(app);

const BASE_URL = "/auth/login";

describe("POST /auth/login", () => {
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
        it("should return 200 status code, if user exists", async () => {
            // arrange
            const userData = {
                name: "test",
                username: "test",
                email: "test@gmail.com",
                password: "testing_right",
            };

            // act
            await helper.createUser(userData);

            const response = await api
                .post(BASE_URL)
                .send(userData)
                .expect(200);

            expect(response.body.email).toBe(userData.email);
        });
    });

    describe("unhappy path", () => {
        describe("user not found", () => {
            it("should return 404 status code, if user does not exist", async () => {
                // arrange
                const userData = {
                    email: "test@gmail.com",
                    password: "testing_right",
                };

                // act
                const response = await api
                    .post(BASE_URL)
                    .send(userData)
                    .expect(404);

                // assert
                assertErrorMessageExists(response, "User not found");
            });
        });

        describe("password is incorrect", () => {
            it("should return 401 status code, if password is incorrect", async () => {
                // arrange
                const userData = {
                    email: "test@gmail.com",
                    password: "testing_password",
                };

                // create user first
                await helper.createUser({
                    name: "test",
                    username: "test",
                    ...userData,
                });

                // act
                const response = await api
                    .post(BASE_URL)
                    .send({
                        ...userData,
                        password: "incorrect_password",
                    })
                    .expect(401);

                // assert
                assertErrorMessageExists(response, "Password is incorrect");
            });
        });

        describe("validation errors", () => {
            it("should return 400 status code, if email is not supplied", async () => {
                // arrange
                const userData = {
                    password: "testing_right",
                };

                // act
                const response = await api
                    .post(BASE_URL)
                    .send(userData)
                    .expect(400);

                // assert

                assertErrorMessageExists(response, "email is missing");
            });

            it("should return 400 status code, if password is not supplied", async () => {
                // arrange
                const userData = {
                    email: "test@gmail.com",
                };

                // act
                const response = await api
                    .post(BASE_URL)
                    .send(userData)
                    .expect(400);

                // assert
                assertErrorMessageExists(response, "password is missing");
            });
        });
    });
});
