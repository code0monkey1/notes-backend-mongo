import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Config } from "../config";
export class TokenService {
    static generateToken(payload: JwtPayload) {
        const token = jwt.sign(payload, Config.JWT_SECRET as string, {
            expiresIn: "1h",
        });
        return token;
    }

    static verifyToken(token: string) {
        const payload = jwt.verify(token, Config.JWT_SECRET as string);
        return payload;
    }
}
