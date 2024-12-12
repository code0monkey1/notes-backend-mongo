import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
import { validationResult } from "express-validator";

export class AuthController {
    constructor() {}

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }

            const body = (await req.body) as IUser;

            res.json(body);
        } catch (e) {
            next(e);
        }
    };
}
