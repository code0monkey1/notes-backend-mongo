import supertest from "supertest";
import app from "../../src/app";
import registerHelper from "./helper";

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
      const userData = registerHelper.getUserData();

      const response = await api.post(BASE_URL).send(userData).expect(201);

      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.username).toBe(userData.username);
    });
  });

  describe("unhappy path", () => {
    describe("when user already exists", () => {
      it("should return 409 status code, if email is duplicate", async () => {
        // arrange
        await registerHelper.createUser(registerHelper.getUserData());

        const usersBefore = await registerHelper.getAllUsers();
        const userData = registerHelper.getUserData();

        // act
        const response = await api.post(BASE_URL).send(userData).expect(409);

        // assert
        expect(response.body.errors).toHaveLength(1);
        console.log(JSON.stringify(response.body.errors, null, 2));
        expect(response.body.errors[0].type).toBe("Email already registered");

        const usersAfter = await registerHelper.getAllUsers();
        expect(usersAfter.length).toBe(usersBefore.length);
      });
    });

    describe("validation errors", () => {
      it("shoud return response code 400 when no body is given", async () => {
        await api.post(BASE_URL).send({}).expect(400);
      });
      it("should return 400 status code if password is less than 8 chars exists", async () => {
        //arrange
        const userData = registerHelper.getUserData();

        //act
        const result = await api
          .post(BASE_URL)
          .send({ ...userData, password: "1234567" })
          .expect(400);

        // assert
        assertErrorMessageExists(
          result,
          "Password must be at least 8 characters long",
        );
      });

      it("should return 400 status code if email is invalid", async () => {
        //arrange

        const userData = registerHelper.getUserData();
        //act

        const result = await api
          .post(BASE_URL)
          .send({ ...userData, email: "invalid_email" })
          .expect(400);

        // assert
        assertErrorMessageExists(result, "Email should be valid");
      });

      it("should return 400 status code if email is missing", async () => {
        //arrange
        const userData = registerHelper.getUserData();

        //act
        const result = await api
          .post(BASE_URL)
          .send({ ...userData, email: "" })
          .expect(400);

        // assert
        assertErrorMessageExists(result, "email is missing");
      });
    });
  });
});

const assertErrorMessageExists = async (result: any, errorMessage: string) => {
  const errorMessages = result.body.errors.map((e: any) => e.msg);

  // assert
  expect(errorMessages).toContainEqual(errorMessage);
};
