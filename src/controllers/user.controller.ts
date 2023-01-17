import * as Koa from "koa"
import { logger } from "../logger"
import { IUser, IUserDocument, Role } from "../models/user.model"
import * as userService from "../services/user.service"
import {
  generateAccessToken,
  generateId,
  generateRefreshToken,
  getHash,
  validateHash,
  validateRefreshToken
} from "../utils"

export const signUp: Koa.Middleware = async ctx => {
  try {
    const {
      role = Role.Basic,
      email,
      password,
      data
    } = ctx.request.body as {
      role: Role
      email: string
      password: string
      data: Object
    }
    const user: IUser = {
      email,
      userId: generateId(),
      password: await getHash(password),
      role,
      data
    }
    await userService.insert(user)
    const refreshToken = generateRefreshToken({
      userId: user.userId,
      role: user.role
    })
    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role
    })
    ctx.status = 200
    ctx.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      secureProxy: true
    })

    return (ctx.body = {
      success: true,
      data: {
        user,
        accessToken
      }
    })
  } catch (err) {
    if (err?.code === 11000) {
      ctx.status = 409
      return (ctx.body = {
        success: false,
        message: "User alredy exists."
      })
    }
    logger.error(`Error creating user: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const login: Koa.Middleware = async ctx => {
  try {
    const { email, password } = ctx.request.body as {
      email: string
      password: string
    }

    const user: IUserDocument | null = await userService.fetchByEmail(email)
    if (user === null) {
      ctx.status = 404
      return (ctx.body = {
        success: false,
        message: "User not found"
      })
    }
    const isPasswordValid = await validateHash(password, user.password)
    if (!isPasswordValid) {
      ctx.status = 401
      return (ctx.body = {
        success: false,
        message: "Invalid password"
      })
    }
    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role
    })
    const refreshToken = generateRefreshToken({
      userId: user.userId,
      role: user.role
    })
    ctx.status = 200
    ctx.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      secureProxy: true
    })

    return (ctx.body = {
      success: true,
      data: {
        user,
        accessToken
      }
    })
  } catch (err) {
    logger.error(`Error logging in user: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const refresh: Koa.Middleware = async ctx => {
  try {
    const token = ctx.cookies.get("refreshToken")
    if (!token) {
      ctx.status = 403
      return (ctx.body = {
        success: false,
        message: "Unauthorized"
      })
    }
    const [isValid, userData] = await validateRefreshToken(token)
    if (!isValid) {
      ctx.status = 406
      return (ctx.body = {
        success: false,
        message: "Invalid refresh token"
      })
    }
    const user: IUserDocument | null = await userService.fetchByUserId(
      userData.userId
    )
    if (user === null) {
      ctx.status = 404
      return (ctx.body = {
        success: false,
        message: "User not found"
      })
    }

    const refreshToken = generateRefreshToken({
      userId: user.userId,
      role: user.role
    })
    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role
    })
    ctx.status = 200
    ctx.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      secureProxy: true
    })

    return (ctx.body = {
      success: true,
      data: {
        accessToken
      }
    })
  } catch (err) {
    logger.error(`Error refreshing token: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const getAllUsers: Koa.Middleware = async ctx => {
  try {
    const offset = Number(ctx.query.offset) || 0
    const limit = Number(ctx.query.limit) || 10
    const users = await userService.fetchAllUsers(offset, limit)
    ctx.status = 200
    return (ctx.body = {
      success: true,
      data: {
        users
      }
    })
  } catch (err) {
    logger.error(`Error fetching users: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const getUser: Koa.Middleware = async ctx => {
  try {
    const userId = ctx.params.userid as string
    const user = await userService.fetchUser(userId)
    if (user === null) {
      ctx.status = 404
      return (ctx.body = {
        success: false,
        message: "User not found"
      })
    }
    ctx.status = 200
    return (ctx.body = {
      success: true,
      data: {
        user
      }
    })
  } catch (err) {
    logger.error(`Error fetching user: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}
