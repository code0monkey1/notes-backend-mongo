import { NextFunction, Request, Response } from "express";

import { validationResult } from "express-validator";
import { RegisterUserType } from "../models/types";
import User from "../models/user.model";
import createHttpError from "http-errors";
import EncryptionService from "../services/EncryptionService";

export class AuthController {
  constructor(private readonly encryptionService: EncryptionService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const body = (await req.body) as RegisterUserType;

      // check if email aready exists
      const existingUser = await User.findOne({ email: body.email });

      if (existingUser) {
        throw createHttpError(409, "Email already registered");
      }

      // encrypt password
      const hashedPassword = await this.encryptionService.encryptPassword(
        body.password,
      );

      // create new user if all ok
      const user = await User.create({
        name: body.name,
        email: body.email,
        username: body.username,
        hashedPassword,
      });

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  };
}
