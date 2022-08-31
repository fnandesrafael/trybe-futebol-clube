import {JwtPayload, sign, SignOptions, verify } from 'jsonwebtoken'
import 'dotenv/config'

const jwtSecret = JSON.stringify(process.env.JWT_SECRET)

const jwtConfig: SignOptions = {
  expiresIn: '15m',
  algorithm: 'HS256'
}

export default class Jwt {
  public static generateJwt = (payload: JwtPayload) => {
    const token = sign(payload, jwtSecret, jwtConfig)
    return token
  }

  public static authJwt = (token: string) => {
    try {
      const decoded = verify(token, jwtSecret)
      return decoded as JwtPayload

    } catch(err) {
      return false
    }
  }
}
