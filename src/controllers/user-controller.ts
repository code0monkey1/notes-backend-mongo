import { NextFunction, Response } from "express";
import { CustomRequest } from "../middlewares/tokenParser";
import { RegisterUserType } from "../models/types";

import User from "../models/user.model";

export class UserController {
    constructor() {}

    async updateUser(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;

            // if user does not exist return 404

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                req.body as RegisterUserType,
                { new: true },
            );

            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }
}
