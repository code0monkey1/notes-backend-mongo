/* eslint-disable @typescript-eslint/require-await */
import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/TokenService";
import createHttpError from "http-errors";
import mongoose from "mongoose";

// Extend the Request interface to include id and email
export interface CustomRequest extends Request {
    user?: {
        id: string;
    };
    note?: {
        content: string;
        user: mongoose.Types.ObjectId;
        important: boolean;
    };
}

const tokenParser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw createHttpError(401, "No token provided");
        }

        const decoded = TokenService.verifyToken(token) as {
            id: string;
            email: string;
        };

        if (!decoded) {
            throw createHttpError(401, "Invalid token");
        }

        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            throw createHttpError(400, "Invalid user id");
        }

        // Attach the user id  to the request object
        req.user = {
            id: decoded.id,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default tokenParser;
