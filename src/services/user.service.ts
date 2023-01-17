import { IUser, IUserDocument, UserModel } from "../models/user.model"

export const insert = async (user: IUser) => {
  await UserModel.create(user)
}

export const fetchByUserId = async (
  userId: string
): Promise<IUserDocument | null> => {
  return await UserModel.findOne({ userId })
}

export const fetchByEmail = async (
  email: string
): Promise<IUserDocument | null> => {
  return await UserModel.findOne({ email })
}

export const fetchAllUsers = async (
  offset: number,
  limit: number
): Promise<IUserDocument[]> => {
  return await UserModel.find().sort({ _id: -1 }).skip(offset).limit(limit)
}

export const fetchUser = async (
  userId: string
): Promise<IUserDocument | null> => {
  return await UserModel.findOne({ userId })
}
