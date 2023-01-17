import * as Koa from "koa"
import { logger } from "../logger"
import { IComment, IPost } from "../models/post.model"
import * as postService from "../services/post.service"
import { generateId } from "../utils"

export const createPost: Koa.Middleware = async ctx => {
  try {
    const { data } = ctx.request.body as { data: string }
    const post: IPost = {
      postId: generateId(),
      userId: ctx.accessTokenData.userId,
      data
    }
    await postService.insert(post)
    ctx.status = 200
    return (ctx.body = {
      success: true,
      data: {
        post
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

export const getPost: Koa.Middleware = async ctx => {
  try {
    const postId = ctx.params.postid as string
    const post = await postService.fetchByPostId(postId)
    if (post === null) {
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
        post
      }
    })
  } catch (err) {
    logger.error(`Error fetching post: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const comment: Koa.Middleware = async ctx => {
  try {
    const postId = ctx.params.postid as string
    const { data } = ctx.request.body as { data: string }
    const comment: IComment = {
      data,
      timestamp: Date.now(),
      userId: ctx.accessTokenData.userId
    }
    await postService.addComment(postId, comment)
    ctx.status = 200
    return (ctx.body = {
      success: true
    })
  } catch (err) {
    logger.error(`Error adding comment on post: ${err}`)
    ctx.status = 500
    return (ctx.body = {
      success: false,
      message: "Server Error. Please try again later."
    })
  }
}

export const getAllPostsOfUser: Koa.Middleware = async ctx => {
  try {
    const offset = Number(ctx.query.offset) || 0
    const limit = Number(ctx.query.limit) || 10
    const userId = ctx.params.userid as string
    const posts = await postService.fetchByUserId(userId, offset, limit)
    ctx.status = 200
    return (ctx.body = {
      success: true,
      data: {
        posts
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
