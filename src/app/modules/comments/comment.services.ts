import Comment from "./comment.model";

type TPayload = {
  postId: string;
  message: string;
};

const createComment = async (userId: string, payload: TPayload) => {
  const { postId, message } = payload;
  const result = await Comment.create({ userId, message, postId });
  return result;
};

export const commentServices = {
  createComment,
};
