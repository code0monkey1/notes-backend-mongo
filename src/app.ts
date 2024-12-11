import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
const app = express();
import authRouter from './routes/auth-router'
import "express-async-errors";

app.use(express.json());

app.get("/data", (req, res) => {
    res.json({ data: "will  crash again" });
});

app.use('/auth',authRouter)

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: HttpError, req: Request, res: Response, _next: NextFunction) => {
        logger.error(error.message);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            errors: [
                {
                    type: error.message,
                    path: "",
                    location: "",
                },
            ],
        });
    },
);

export default app;
