import { Types } from "mongoose";
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

const getAllPosts = async (limit?: string, userId?: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  let result;

  const isMembershipExpired =
    user.membershipEnd && new Date() > new Date(user.membershipEnd);

  if (isMembershipExpired) {
    result = await Post.find({ type: "basic" })
      .populate("userId")
      .limit(limit ? Number(limit) : 0);
  } else if (user.role === "admin") {
    result = await Post.find()
      .populate("userId")
      .limit(limit ? Number(limit) : 0);
  } else {
    result = await Post.find()
      .populate("userId")
      .limit(limit ? Number(limit) : 0);
  }
  return result;
};

const getSinglePost = async (id: string) => {
  const result = await Post.findById(id).populate("userId");
  return result;
};

const getMostLikedPosts = async () => {
  const mostLikedPosts = await Vote.aggregate([
    {
      $project: {
        postId: 1,
        likeCount: { $size: "$votes" }, // Count the number of votes
      },
    },
    {
      $group: {
        _id: "$postId", // Group by postId
        totalLikes: { $sum: "$likeCount" }, // Sum likes for each post
      },
    },
    {
      $sort: { totalLikes: -1 }, // Sort by total likes in descending order
    },
    {
      $limit: 6, // Limit to top 6 posts
    },
    {
      $lookup: {
        from: "posts", // Lookup from the posts collection
        localField: "_id", // The grouped postId
        foreignField: "_id", // The post ID in the posts collection
        as: "postDetails", // Name of the field to store the post details
      },
    },
    {
      $unwind: {
        path: "$postDetails", // Unwind the post details array
        preserveNullAndEmptyArrays: true, // Keep posts even if no details found
      },
    },
    {
      $lookup: {
        from: "users", // Lookup from the users collection
        localField: "postDetails.userId", // The userId field in post details
        foreignField: "_id", // The ID field in the users collection
        as: "userDetails", // Name of the field to store user details
      },
    },
    {
      $unwind: {
        path: "$userDetails", // Unwind the user details array
        preserveNullAndEmptyArrays: true, // Keep posts even if no user found
      },
    },
    {
      $project: {
        _id: 1,
        totalLikes: 1,
        postDetails: {
          _id: "$postDetails._id",
          content: "$postDetails.content",
          userId: "$postDetails.userId",
          images: "$postDetails.images",
          category: "$postDetails.category",
          createdAt: "$postDetails.createdAt",
        },
        userDetails: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          profile: "$userDetails.profile",
          role: "$userDetails.role",
          bio: "$userDetails.bio",
        },
      },
    },
  ]);

  return mostLikedPosts;
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
