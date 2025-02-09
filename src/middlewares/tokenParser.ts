/* eslint-disable @typescript-eslint/require-await */
import { Request, Response, NextFunction } from "express";
import { TokenService } from "../routes/TokenService";
import createHttpError from "http-errors";

// Extend the Request interface to include id and email
export interface CustomRequest extends Request {
    user?: {
        id: string;
        email: string;
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

        // Attach the user id and email to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default tokenParser;
