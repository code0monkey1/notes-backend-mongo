import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
const app = express();
import authRouter from "./routes/auth-router";

app.use(express.json());

app.use("/auth", authRouter);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: HttpError, req: Request, res: Response, _next: NextFunction) => {
    logger.error(error);
    const statusCode = error.statusCode || error.status || 500;

    res.status(statusCode).json({
      errors: [
        { name: error.name, type: error.message, path: "", location: "" },
      ],
    });
  },
);

export default app;
