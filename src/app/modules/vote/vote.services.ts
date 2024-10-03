import { Types } from "mongoose";
import Vote from "./vote.model";
import Post from "../post/post.model";

const addOrRemoveVote = async (userId: string, postId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const postObjectId = new Types.ObjectId(postId);

  let vote = await Vote.findOne({ postId: postObjectId });

  const post = await Post.findById(postObjectId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (!vote) {
    vote = new Vote({
      postId: postObjectId,
      votes: [{ userId: userObjectId }],
    });
    await vote.save();
    post.likeCount += 1;
    await post.save();

    return vote;
  } else {
    const hasVoted = vote.votes.some((v) => v.userId.equals(userObjectId));

    if (hasVoted) {
      vote.votes = vote.votes.filter((v) => !v.userId.equals(userObjectId));
      await vote.save();
      post.likeCount -= 1;
      await post.save();

      return vote;
    } else {
      vote.votes.push({ userId: userObjectId });
      await vote.save();
      post.likeCount += 1;
      await post.save();

      return vote;
    }
  }
};

export const getAllVote = async (postId: string) => {
  const result = await Vote.findOne({ postId: new Types.ObjectId(postId) });
  return result;
};

export const voteServices = {
  addOrRemoveVote,
  getAllVote,
};
