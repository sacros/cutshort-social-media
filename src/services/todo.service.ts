import { ITodo, ITodoDocument, TodoModel } from "../models/todo.model"

export const insert = async (todo: ITodo) => {
  await TodoModel.create(todo)
}

export const fetchByTodoId = async (
  todoId: string
): Promise<ITodoDocument | null> => {
  return await TodoModel.findOne({ todoId })
}

export const updateByTodoId = async (todoId: string, data: Partial<ITodo>) => {
  await TodoModel.updateOne({ todoId }, data)
}

export const deleteByTodoId = async (todoId: string) => {
  await TodoModel.deleteOne({ todoId })
}

export const fetchByUserId = async (
  userId: string,
  offset: number,
  limit: number
): Promise<ITodoDocument[]> => {
  return await TodoModel.find({ userId })
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
}
