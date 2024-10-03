import { Schema, model, Document } from "mongoose";
import { IPost } from "./post.interface";

// Define the schema
const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // Correct usage here
      ref: "User", // Reference to the User model
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Post model
const Post = model<IPost>("Post", postSchema);

export default Post;
