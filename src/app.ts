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
  (error: HttpError, req: Request, res: Response, _next: NextFunction) => {
    logger.error(error);
    const statusCode = error.statusCode || error.status || 500;

    if (error instanceof mongoose.Error.CastError) {
      error.statusCode = 400;
      error.message = "Invalid id Mongoose id";
    }

    res.status(statusCode).json({
      errors: [
        {
          name: error.name,
          type: error.message,
          stack: "",
          path: "",
          location: "",
        },
      ],
    });
  },
);

export default app;
