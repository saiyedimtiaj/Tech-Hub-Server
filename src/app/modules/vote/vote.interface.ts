import { Types } from "mongoose";

export type TVote = {
  postId: Types.ObjectId; // Correctly use Types.ObjectId
  votes: { userId: Types.ObjectId }[]; // Same here for userId
};
