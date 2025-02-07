import { NextFunction, Request, Response } from "express";

import { validationResult } from "express-validator";
import { LoginUserType, RegisterUserType, UserType } from "../models/types";
import User from "../models/user.model";
import createHttpError from "http-errors";
import EncryptionService from "../services/EncryptionService";
import { validationErrorParser } from "../utils/helper";

export class AuthController {
    constructor(private readonly encryptionService: EncryptionService) {}

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).json(validationErrorParser(result));
            }

            const body = (await req.body) as RegisterUserType;

            // check if email aready exists
            const existingUser = await User.findOne({ email: body.email });

            if (existingUser) {
                throw createHttpError(409, "Email already registered");
            }

            // encrypt password
            const hashedPassword = await this.encryptionService.encryptPassword(
                body.password,
            );

            const user = await User.create({
                name: body.name,
                email: body.email,
                username: body.username,
                hashedPassword,
            });

            // create user jwt token

            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).json(validationErrorParser(result));
            }

            const { email, password } = (await req.body) as LoginUserType;

            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                throw createHttpError(404, "User not found");
            }

            const isPasswordCorrect =
                await this.encryptionService.verifyPassword(
                    password,
                    existingUser.hashedPassword,
                );

            if (!isPasswordCorrect) {
                throw createHttpError(401, "Password is incorrect");
            }

            const body = req.body as UserType;

            res.json(body);
        } catch (e) {
            next(e);
        }
    };
}
