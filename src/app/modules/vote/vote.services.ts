import { Types } from "mongoose";
import Vote from "./vote.model";

const addOrRemoveVote = async (userId: string, postId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const postObjectId = new Types.ObjectId(postId);

  // Find the vote document based on postId
  let vote = await Vote.findOne({ postId: postObjectId });

  if (!vote) {
    // If no vote document exists, create a new one and add the user
    vote = new Vote({
      postId: postObjectId,
      votes: [{ userId: userObjectId }],
    });
    await vote.save();
    return vote;
  } else {
    // Check if the user has already voted
    const hasVoted = vote.votes.some((v) => v.userId.equals(userObjectId));

    if (hasVoted) {
      // Remove the user's vote
      vote.votes = vote.votes.filter((v) => !v.userId.equals(userObjectId));
      await vote.save();
      return vote;
    } else {
      // Add the user's vote
      vote.votes.push({ userId: userObjectId });
      await vote.save();
      return vote;
    }
  }
};

export const voteServices = {
  addOrRemoveVote,
};
