import * as Koa from "koa"
import * as Router from "koa-router"
import * as userControllers from "./controllers/user.controller"
import * as todoControllers from "./controllers/todo.controller"
import * as postControllers from "./controllers/post.controller"
import { validateAccessToken } from "./utils"

export const appRouter = new Router()

const accessTokenValidator: Koa.Middleware = async (ctx, next) => {
  const accessToken = ctx.header["x-access-token"]
  if (!accessToken) {
    ctx.status = 403
    return (ctx.body = {
      success: false,
      message: "Unauthorized"
    })
  }
  const [isValid, userData] = await validateAccessToken(accessToken)
  if (!isValid) {
    ctx.status = 406
    return (ctx.body = {
      success: false,
      message: "Invalid access token"
    })
  }
  ctx.accessTokenData = userData
  await next()
}

// user-routes
appRouter.post("user", userControllers.signUp)
appRouter.post("login", userControllers.login)
appRouter.post("refresh", userControllers.refresh)
appRouter.get("users", accessTokenValidator, userControllers.getAllUsers)
appRouter.get("users/:userid", accessTokenValidator, userControllers.getUser)

appRouter.post("todo", accessTokenValidator, todoControllers.createTodo)
appRouter.get("todos/:todoid", accessTokenValidator, todoControllers.getTodo)
appRouter.put("todos/:todoid", accessTokenValidator, todoControllers.updateTodo)
appRouter.patch(
  "todos/:todoid",
  accessTokenValidator,
  todoControllers.updateTodoStatus
)
appRouter.delete(
  "todos/:todoid",
  accessTokenValidator,
  todoControllers.deleteTodo
)
appRouter.get(
  "users/:userid/todos",
  accessTokenValidator,
  todoControllers.getAllTodosOfUser
)

appRouter.post("post", accessTokenValidator, postControllers.createPost)
appRouter.get("posts/:postid", accessTokenValidator, postControllers.getPost)
appRouter.post(
  "posts/:postid/comment",
  accessTokenValidator,
  postControllers.comment
)
appRouter.get(
  "users/:userid/posts",
  accessTokenValidator,
  postControllers.getAllPostsOfUser
)
