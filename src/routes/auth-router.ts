/* eslint-disable @typescript-eslint/no-misused-promises */
import { AuthController } from "../controllers/auth-controller";
import registerValidator from "../validators/register-validator";
const authController = new AuthController();

import { Router } from "express";

const router = Router();

router.post("/register", registerValidator, authController.register);

export default router;
