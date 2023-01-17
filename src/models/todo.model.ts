import * as mongoose from "mongoose"
const Schema = mongoose.Schema

export interface ITodo {
  todoId: string
  userId: string
  data: string
  isCompleted: boolean
}

export type ITodoDocument = ITodo & mongoose.Document

const TodoSchema = new Schema({
  todoId: {
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
  isCompleted: {
    type: Boolean,
    default: false
  }
})

export const TodoModel = mongoose.model<ITodoDocument>(
  "todo",
  TodoSchema,
  "todo"
)

TodoModel.createIndexes()
