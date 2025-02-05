import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
const app = express();
import authRouter from "./routes/auth-router";
import mongoose from "mongoose";

app.use(express.json());

app.use("/auth", authRouter);

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
        logger.error(error);

        if (error instanceof mongoose.Error.CastError) {
            error.statusCode = 400;
            error.message = "Invalid id Mongoose id";
        }

        const statusCode = error.statusCode || error.status || 500;

        res.status(statusCode).json({
            errors: [
                {
                    type: error.name,
                    message: error.message,
                    stack: "",
                    path: "",
                    location: "",
                },
            ],
        });
    },
);
export default app;
