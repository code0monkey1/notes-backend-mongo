/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import tokenParser from "../middlewares/tokenParser";
import { UserController } from "../controllers/user-controller";

const userController = new UserController();

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/unbound-method
router.patch("/me", tokenParser, userController.updateUser);

export default router;
