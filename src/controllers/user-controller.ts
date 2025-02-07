import { NextFunction, Response } from "express";
import { CustomRequest } from "../middlewares/tokenParser";
import { RegisterUserType } from "../models/types";
import { UserService } from "../services/UserService";
import createHttpError from "http-errors";

export class UserController {
    constructor(private readonly userService: UserService) {}

    updateUser = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = req.user?.id as string;

            const user = await this.userService.getUserById(userId);

            if (!user) {
                throw createHttpError(404, "User not found");
            }

            const updatedUser = await this.userService.updateUserById(
                userId,
                req.body as RegisterUserType,
            );

            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    };

    deleteUser = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = req.user?.id as string;

            const user = await this.userService.getUserById(userId);

            if (!user) {
                throw createHttpError(404, "User not found");
            }

            await this.userService.findByIdAndDelete(userId);

            res.end();
        } catch (err) {
            next(err);
        }
    };
}
