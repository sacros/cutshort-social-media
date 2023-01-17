import { initDB } from "./db"
import { logger } from "./logger"
import { config } from "./config"
import * as Koa from "koa"
import * as Router from "koa-router"
import { appRouter } from "./router"
import * as bodyparser from "koa-bodyparser"

const app = new Koa()
app.use(bodyparser())

const router = new Router()
router.use("/", appRouter.routes())
app.use(router.routes())

export const startServer = () => {
  const port = config.PORT
  app.listen(port, () => logger.info(`server is running on port ${port}`))
  logger.info("initializing DB connection")
  initDB()
  logger.info("DB connection successful")
}

try {
  startServer()
} catch (err) {
  logger.error(err)
  process.exit(1)
}
