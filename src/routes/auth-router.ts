/* eslint-disable @typescript-eslint/no-misused-promises */
import { AuthController } from "../controllers/auth-controller";
import EncryptionService from "../services/EncryptionService";
import { UserService } from "../services/UserService";

import loginValidator from "../validators/login-validator";
import registerValidator from "../validators/register-validator";

const encryptionService = new EncryptionService();
const userService = new UserService();
const authController = new AuthController(encryptionService, userService);

import { Router } from "express";

const router = Router();

router.post("/register", registerValidator, authController.register);

router.post("/login", loginValidator, authController.login);

export default router;
