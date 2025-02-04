/* eslint-disable @typescript-eslint/no-misused-promises */
import { AuthController } from "../controllers/auth-controller";
import EncryptionService from "../services/EncryptionService";
import registerValidator from "../validators/register-validator";

const encryptionService = new EncryptionService();

const authController = new AuthController(encryptionService);

import { Router } from "express";

const router = Router();

router.post("/register", registerValidator, authController.register);

export default router;
