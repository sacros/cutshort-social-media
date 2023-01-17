import * as mongoose from "mongoose"
const Schema = mongoose.Schema

export interface IUser {
  email: string
  userId: string
  password: string
  role: Role
  data: Object
}

export enum Role {
  Basic = "basic",
  Admin = "admin"
}

export type IUserDocument = IUser & mongoose.Document

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "basic",
      enum: ["basic", "admin"]
    },
    data: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<IUserDocument>(
  "user",
  UserSchema,
  "user"
)

UserModel.createIndexes()
