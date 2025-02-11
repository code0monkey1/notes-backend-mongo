import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { CustomRequest } from "./tokenParser";

const noteAuthMiddleware = (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!(req.note && req.note.user)) {
            throw createHttpError(
                400,
                "Note object not attached to custom request object",
            );
        }

        if (req.note.user.toString() !== req.user?.id) {
            throw createHttpError(401, "unauthorized user");
        }

        next();
    } catch (err) {
        next(err);
    }
};

export default noteAuthMiddleware;
