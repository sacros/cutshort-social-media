import * as dotenv from "dotenv"

dotenv.config()

const { env } = process

export const config = {
  PORT: Number(env.PORT) || 5001,
  DB_URI:
    env.DB_URI ||
    "mongodb+srv://sacros:sacros816@cluster0.kbitok7.mongodb.net/admin?replicaSet=atlas-fy2paz-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1",
  ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET || "accesstokensecret1",
  ACCESS_TOKEN_EXPIRY: env.ACCESS_TOKEN_EXPIRY || "10m",
  REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET || "refreshtokensecret1",
  REFRESH_TOKEN_EXPIRY: env.REFRESH_TOKEN_EXPIRY || "1d"
}
