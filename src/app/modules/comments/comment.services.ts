import { Types } from "mongoose";
import Comment from "./comment.model";

type TPayload = {
  postId: string;
  message: string;
};

const createComment = async (userId: string, payload: TPayload) => {
  const { postId, message } = payload;
  const body = { userId, message, postId };
  console.log(body);
  const result = await Comment.create(body);
  return result;
};

const getAllComment = async (id: string) => {
  const result = await Comment.find({
    postId: new Types.ObjectId(id),
  }).populate("userId");
  return result;
};

export const commentServices = {
  createComment,
  getAllComment,
};
