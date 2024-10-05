import { model, Schema } from "mongoose";
import { TVote } from "./vote.interface";

const voteSchema = new Schema<TVote>({
  postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  votes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

// Create a Mongoose model
const Vote = model<TVote>("Vote", voteSchema);

export default Vote;
