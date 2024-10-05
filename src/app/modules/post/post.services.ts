import { SortOrder, Types } from "mongoose";
import { IPost } from "./post.interface";
import Post from "./post.model";
import Vote from "../vote/vote.model";
import Comment from "../comments/comment.model";
import User from "../auth/auth.model";

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

const getAllPosts = async (
  limit?: string,
  userId?: string,
  sort?: "asc" | "desc" | undefined
) => {
  const sortOption: { [key: string]: SortOrder } = sort
    ? { likeCount: sort }
    : {};
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  let result;

  // const isMembershipExpired = new Date() > new Date(user.membershipEnd);

  if (user?.membershipEnd && new Date() > new Date(user.membershipEnd)) {
    result = await Post.find({ type: "besic" })
      .populate("userId")
      .limit(limit ? Number(limit) : 0)
      .sort(sortOption);
  }

  result = await Post.find()
    .populate("userId")
    .limit(limit ? Number(limit) : 0)
    .sort(sortOption);
  return result;
};

const getSinglePost = async (id: string) => {
  const result = await Post.findById(id).populate("userId");
  return result;
};

const getMostLikedPosts = async () => {
  const result = await Post.find()
    .sort({ likeCount: "desc" })
    .populate("userId");
  return result;
};

const deletePost = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);
  await Comment.deleteMany({
    postId: new Types.ObjectId(id),
  });
  await Vote.deleteOne({ postId: new Types.ObjectId(id) });
  return result;
};

const getSearchedPost = async (query: string) => {
  const searchResults = await Post.find({
    $or: [{ content: { $regex: query, $options: "i" } }],
  });
  return searchResults;
};

export const postServices = {
  createPost,
  getMyPosts,
  getAllPosts,
  getSinglePost,
  getMostLikedPosts,
  deletePost,
  getSearchedPost,
};
