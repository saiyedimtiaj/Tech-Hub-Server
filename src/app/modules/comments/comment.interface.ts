import { Schema } from "mongoose";

export type TComment = {
  message: string;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
};
