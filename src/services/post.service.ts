import { IComment, IPost, IPostDocument, PostModel } from "../models/post.model"

export const insert = async (post: IPost) => {
  await PostModel.create(post)
}

export const fetchByPostId = async (
  postId: string
): Promise<IPostDocument | null> => {
  return await PostModel.findOne({ postId })
}

export const addComment = async (postId: string, comment: IComment) => {
  return await PostModel.updateOne({ postId }, { $push: { comments: comment } })
}

export const fetchByUserId = async (
  userId: string,
  offset: number,
  limit: number
): Promise<IPostDocument[]> => {
  return await PostModel.find({ userId })
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
}
