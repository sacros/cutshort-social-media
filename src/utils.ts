import * as bcrypt from "bcrypt"
const { nanoid } = require("nanoid")
import * as jwt from "jsonwebtoken"
import { config } from "./config"
import { Role } from "./models/user.model"

export const getHash = async (
  text: string,
  saltRounds = 10
): Promise<string> => {
  return await bcrypt.hash(text, await bcrypt.genSalt(saltRounds))
}

export const validateHash = async (
  text: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(text, hash)
}

export const generateId = (maxLength = 10) => nanoid(maxLength)

export const generateJwtToken = (
  data: Object,
  secret: string,
  expireTime: string
) => jwt.sign(data, secret, { expiresIn: expireTime })

export const generateAccessToken = (data: Object) =>
  generateJwtToken(data, config.ACCESS_TOKEN_SECRET, config.ACCESS_TOKEN_EXPIRY)

export const generateRefreshToken = (data: Object) =>
  generateJwtToken(
    data,
    config.REFRESH_TOKEN_SECRET,
    config.REFRESH_TOKEN_EXPIRY
  )

export const validateJwtToken = async (
  token: string,
  secret: string
): Promise<[true, { userId: string; role: Role }] | [false]> => {
  try {
    const { userId, role, exp } = (await jwt.verify(token, secret, {
      ignoreExpiration: true
    })) as { userId: string; role: Role; exp: number }
    // if (exp < Date.now().valueOf() / 1000) return [false]
    return [true, { userId, role }]
  } catch (err) {
    return [false]
  }
}

export const validateAccessToken = async accessToken =>
  validateJwtToken(accessToken, config.ACCESS_TOKEN_SECRET)

export const validateRefreshToken = async refreshToken =>
  validateJwtToken(refreshToken, config.REFRESH_TOKEN_SECRET)
