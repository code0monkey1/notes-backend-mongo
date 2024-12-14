import { NextFunction, Request, Response } from "express";

import { validationResult } from "express-validator";
import { UserType } from "../models/types";
import User from "../models/user.model";
import createHttpError from "http-errors";

export class AuthController {
  constructor() {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const body = (await req.body) as UserType;

      // check if email aready exists
      const existingUser = await User.findOne({ email: body.email });

      if (existingUser) {
        throw createHttpError(409, "Email already registered");
      }

      // create new user if all ok
      const user = await User.create(body);

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  };
}
