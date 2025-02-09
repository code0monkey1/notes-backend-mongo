import { NextFunction, Response } from "express";
import { CustomRequest } from "../middlewares/tokenParser";
import { RegisterUserType } from "../models/types";
import UserService from "../services/UserService";

export class UserController {
    constructor(private readonly userService: UserService) {}

    updateUser = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = req.user?.id as string;

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
            await this.userService.findByIdAndDelete(userId);

            res.end();
        } catch (err) {
            next(err);
        }
    };
}
