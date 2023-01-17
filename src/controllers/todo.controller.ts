import * as Koa from "koa"
import { logger } from "../logger"
import { ITodo } from "../models/todo.model"
import * as todoService from "../services/todo.service"
import { generateId } from "../utils"

export const createTodo: Koa.Middleware = async ctx => {
  try {
    const { data } = ctx.request.body as { data: string }
    const todo: ITodo = {
      todoId: generateId(),
      userId: ctx.accessTokenData.userId,
      data,
      isCompleted: false
    }
    await todoService.insert(todo)
    ctx.status = 200
    return (ctx.body = {
      success: true,
      data: {
        todo
      }
    })
  } catch (err) {
    logger.error(`Error creating todo: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const getTodo: Koa.Middleware = async ctx => {
  try {
    const todoId = ctx.params.todoid as string
    const todo = await todoService.fetchByTodoId(todoId)
    if (todo === null) {
      ctx.status = 404
      return (ctx.body = {
        success: false,
        message: "Todo not found"
      })
    }
    ctx.status = 200
    return (ctx.body = {
      success: true,
      data: {
        todo
      }
    })
  } catch (err) {
    logger.error(`Error fetching todo: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const updateTodo: Koa.Middleware = async ctx => {
  try {
    const todoId = ctx.params.todoid as string
    const { data } = ctx.request.body as { data: string }
    await todoService.updateByTodoId(todoId, { data })
    ctx.status = 200
    return (ctx.body = {
      success: true
    })
  } catch (err) {
    logger.error(`Error fetching todo: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const updateTodoStatus: Koa.Middleware = async ctx => {
  try {
    const todoId = ctx.params.todoid as string
    const { isCompleted } = ctx.request.body as { isCompleted: boolean }
    await todoService.updateByTodoId(todoId, { isCompleted })
    ctx.status = 200
    return (ctx.body = {
      success: true
    })
  } catch (err) {
    logger.error(`Error fetching todo: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const deleteTodo: Koa.Middleware = async ctx => {
  try {
    const todoId = ctx.params.todoid as string
    await todoService.deleteByTodoId(todoId)
    ctx.status = 200
    return (ctx.body = {
      success: true
    })
  } catch (err) {
    logger.error(`Error fetching todo: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const getAllTodosOfUser: Koa.Middleware = async ctx => {
  try {
    const offset = Number(ctx.query.offset) || 0
    const limit = Number(ctx.query.limit) || 10
    const userId = ctx.params.userid as string
    const todos = await todoService.fetchByUserId(userId, offset, limit)
    ctx.status = 200
    return (ctx.body = {
      success: true,
      data: {
        todos
      }
    })
  } catch (err) {
    logger.error(`Error fetching posts: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}
