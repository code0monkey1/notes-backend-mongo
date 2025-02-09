/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import tokenParser from "../middlewares/tokenParser";
import { UserController } from "../controllers/user-controller";
import UserService from "../services/UserService";
const userService = new UserService();

const userController = new UserController(userService);

const router = Router();

router.patch("/me", tokenParser, userController.updateUser);
router.delete("/me", tokenParser, userController.deleteUser);

export default router;
