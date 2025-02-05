import User from "../../src/models/user.model";

export const getUserData = () => {
    return {
        name: "test",
        email: "test@gmail.com",
        password: "testing_right",
        username: "test",
    };
};

export const getAllUsers = async () => {
    const users = await User.find({});

    return users;
};

export const createUser = async (userData: any) => {
    const user = await User.create({
        name: userData.name,
        email: userData.email,
        username: userData.username,
        hashedPassword: "hashedPassword",
    });

    return user;
};

export const assertErrorMessageExists = async (
    result: any,
    errorMessage: string,
) => {
    const errorMessages = result.body.errors.map((e: any) => e.message);

    // assert
    expect(errorMessages).toContainEqual(errorMessage);
};

export default {
    getUserData,
    getAllUsers,
    createUser,
    assertErrorMessageExists,
};
