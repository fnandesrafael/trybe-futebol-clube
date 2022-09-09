import { JwtPayload, sign, SignOptions, verify } from 'jsonwebtoken';
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';

const jwtSecret = process.env.JWT_SECRET || 'jwt_secret';

const jwtConfig: SignOptions = {
  expiresIn: '15m',
  algorithm: 'HS256',
};

export default class Jwt {
  public static generateJwt = (payload: JwtPayload) => {
    const token = sign(payload, jwtSecret, jwtConfig);
    return token;
  };

  public static authJwt = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(404).json({ message: 'Authorization token was not found' });
    } try {
      const decode = verify(authorization, jwtSecret);
      res.locals.decode = decode;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  };
}
