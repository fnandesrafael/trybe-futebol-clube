import {JwtPayload, sign, SignOptions } from 'jsonwebtoken'
import 'dotenv/config'

const jwtSecret = JSON.stringify(process.env.JWT_SECRET)

const jwtConfig: SignOptions = {
  expiresIn: '15m',
  algorithm: 'HS256'
}

const generateJwt = (payload: JwtPayload) => {
  const token = sign(payload, jwtSecret, jwtConfig)
  return token
}

export default generateJwt