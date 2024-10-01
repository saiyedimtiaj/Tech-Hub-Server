import { Types } from "mongoose";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createPost = async (postData: IPost) => {
  const result = await Post.create(postData);
  return result;
};

const getMyPosts = async (id: string) => {
  const result = await Post.find({ userId: new Types.ObjectId(id) }).populate(
    "userId"
  );
  return result;
};
const getAllPosts = async () => {
  const result = await Post.find().populate("userId");
  return result;
};

export const postServices = {
  createPost,
  getMyPosts,
  getAllPosts,
};
