import { Document, Schema } from "mongoose";

// Define the interface for the Post document
export interface IPost extends Document {
  content: string;
  userId?: Schema.Types.ObjectId; // Correctly type it as Schema.Types.ObjectId
  images: string[];
  category: string;
  type: string;
  likeCount: number;
}
