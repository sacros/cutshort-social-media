import * as mongoose from "mongoose"
const Schema = mongoose.Schema

export interface IPost {
  postId: string
  userId: string
  data: string
}

export interface IComment {
  data: string
  timestamp: Number
  userId: string
}

export type IPostDocument = IPost & mongoose.Document

const PostSchema = new Schema({
  postId: {
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
    index: true
  },
  data: {
    type: String
  },
  comments: [
    {
      data: { type: String },
      timestamp: { type: Number },
      userId: { type: String }
    }
  ]
})

export const PostModel = mongoose.model<IPostDocument>(
  "post",
  PostSchema,
  "post"
)

PostModel.createIndexes()
