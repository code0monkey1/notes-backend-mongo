import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/TokenService";

// Extend the Request interface to include id and email
export interface CustomRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

// eslint-disable-next-line @typescript-eslint/require-await
const tokenParser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = TokenService.verifyToken(token) as {
            id: string;
            email: string;
        };

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
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
