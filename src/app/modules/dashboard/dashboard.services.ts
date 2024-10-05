import { Types } from "mongoose";
import Post from "../post/post.model";
import { getDailyData } from "../../utils/getDailyData";
import Comment from "../comments/comment.model";
import { getWeeklyData } from "../../utils/getWeeklyData";
import { getMonthlyData } from "../../utils/getMonthlyData";
import {
  getDailyVoteData,
  getMonthlyVoteData,
  getWeeklyVoteData,
} from "../../utils/voatAnalytices";

const dailyPostAnalytics = async (userId: string) => {
  const post = await Post.findOne({ userId: new Types.ObjectId(userId) });

  const postData = await getDailyData(Post, userId, "userId");
  const comment = await getDailyData(Comment, post?._id as string, "postId");
  const voat = await getDailyVoteData(post?._id as string);

  const postCount = postData.reduce((ace, i) => ace + i.count, 0);
  const commentCount = comment.reduce((ace, i) => ace + i.count, 0);
  const voatCount = voat.reduce((ace, i) => ace + i.count, 0);
  return { postCount, commentCount, comment, postData, voat, voatCount };
};

const weeklyPostAnalytics = async (userId: string) => {
  const post = await Post.findOne({ userId: new Types.ObjectId(userId) });

  const postData = await getWeeklyData(Post, userId, "userId");
  const comment = await getWeeklyData(Comment, post?._id as string, "postId");
  const voat = await getWeeklyVoteData(post?._id as string);

  const postCount = postData.reduce((ace, i) => ace + i.count, 0);
  const commentCount = comment.reduce((ace, i) => ace + i.count, 0);
  const voatCount = voat.reduce((ace, i) => ace + i.count, 0);
  return { postCount, commentCount, comment, postData, voat, voatCount };
};

const monthlyPostAnalytics = async (userId: string) => {
  const post = await Post.findOne({ userId: new Types.ObjectId(userId) });

  const postData = await getMonthlyData(Post, userId, "userId");
  const comment = await getMonthlyData(Comment, post?._id as string, "postId");
  const voat = await getMonthlyVoteData(post?._id as string);

  const postCount = postData.reduce((ace, i) => ace + i.count, 0);
  const commentCount = comment.reduce((ace, i) => ace + i.count, 0);
  const voatCount = voat.reduce((ace, i) => ace + i.count, 0);
  return { postCount, commentCount, comment, postData, voat, voatCount };
};

export const dashboardService = {
  dailyPostAnalytics,
  weeklyPostAnalytics,
  monthlyPostAnalytics,
};
