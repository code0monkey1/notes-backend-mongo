import supertest from "supertest";
import app from "../../src/app";
export const userData = {
    name: "test",
    email: "test@gmail.com",
    password: "testing_right",
    username: "test",
};

const BASE_URL = "/auth/register";
const api = supertest(app);

describe("POST /auth/register", () => {
    describe("happy path", () => {
        it("should have the supplied body in request", async () => {
            const userDataWithEmail = { ...userData, email: "email@gmail.com" };

            const response = await api
                .post(BASE_URL)
                .send(userDataWithEmail)
                .expect(200);

            expect(response.body).toEqual(userDataWithEmail);
        });
    });

    describe("unhappy path", () => {
        describe("validation errors", () => {
            it("shoud return response code 400 when no body is given", async () => {
                await api.post(BASE_URL).send({}).expect(400);
            });
            it("should return 400 status code if password is less than 8 chars exists", async () => {
                //arrange

                //act // assert
                const result = await api
                    .post(BASE_URL)
                    .send({ ...userData, password: "1234567" })
                    .expect(400);

                expect(result.body.errors).toHaveLength(1); // Expecting one validation error
                expect(result.body.errors[0].msg).toBe(
                    "Password must be at least 8 characters long",
                );
            });

            it("should return 400 status code if email is invalid", async () => {
                //arrange
                //act
                // assert
                const result = await api
                    .post(BASE_URL)
                    .send({ ...userData, email: "invalid_email" })
                    .expect(400);

                expect(result.body.errors).toHaveLength(1); // Expecting one validation error
                expect(result.body.errors[0].msg).toBe("Email should be valid");
            });
        });
    });
});
