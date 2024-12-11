/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AuthController } from "../controllers/auth-controller";
const authController = new AuthController()

import { Router } from "express";

const router = Router();


router.post('/register',authController.register)


export default router




