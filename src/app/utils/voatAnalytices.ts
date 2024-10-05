import { Types } from "mongoose";
import Vote from "../modules/vote/vote.model";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

interface IVote {
  userId: string;
  createdAt: Date;
}

interface IPostVote {
  _id: string;
  postId: string;
  votes: IVote[];
  __v: number;
}

interface IWeeklyVoteData {
  week: string; // Format: "MM-DD - MM-DD"
  count: number; // Number of votes in that week
}

export const getWeeklyVoteData = async (postId: string) => {
  const voteData: IPostVote | null = await Vote.findOne({
    postId: new Types.ObjectId(postId),
  });

  // Check if voteData is null
  if (!voteData) {
    throw new AppError(httpStatus.NOT_FOUND, "No voat found");
  }

  const weeklyVoteData: IWeeklyVoteData[] = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Set to the start of the week (Sunday)

  // Group votes by week
  for (let i = 0; i < 6; i++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(startOfWeek.getDate() - i * 7); // Move back 7 days for each week

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of the week

    const weekVotesCount = voteData.votes.filter((vote) => {
      const voteDate = new Date(vote.createdAt);
      return voteDate >= weekStart && voteDate <= weekEnd;
    }).length;

    const weekRange = `${(weekStart.getMonth() + 1).toString().padStart(2, "0")}-${weekStart.getDate().toString().padStart(2, "0")} - ${(weekEnd.getMonth() + 1).toString().padStart(2, "0")}-${weekEnd.getDate().toString().padStart(2, "0")}`;

    weeklyVoteData.push({
      week: weekRange,
      count: weekVotesCount,
    });
  }

  return weeklyVoteData.reverse();
};

interface IDailyVoteData {
  day: string; // Format: "Day, Month Date" (e.g., "Monday, October 1")
  count: number; // Number of votes on that day
}

export const getDailyVoteData = async (postId: string) => {
  const voteData: IPostVote | null = await Vote.findOne({
    postId: new Types.ObjectId(postId),
  });

  if (!voteData) {
    return []; // Return an empty array instead of an object
  }

  const dailyVoteData: IDailyVoteData[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6); // Set to 6 days ago

  // Group votes by day
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i); // Move forward by i days

    const dayVotesCount = voteData.votes.filter((vote) => {
      const voteDate = new Date(vote.createdAt);
      return (
        voteDate.getFullYear() === currentDay.getFullYear() &&
        voteDate.getMonth() === currentDay.getMonth() &&
        voteDate.getDate() === currentDay.getDate()
      );
    }).length;

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // Changed to long for full day names
    };
    const dayString = currentDay.toLocaleDateString("en-US", options);

    dailyVoteData.push({
      day: dayString,
      count: dayVotesCount,
    });
  }

  return dailyVoteData.reverse(); // Returns the daily vote data directly
};

interface IMonthlyVoteData {
  month: string; // Format: "Month Year" (e.g., "October 2024")
  count: number; // Number of votes in that month
}

export const getMonthlyVoteData = async (postId: string) => {
  const voteData: IPostVote | null = await Vote.findOne({
    postId: new Types.ObjectId(postId),
  });

  if (!voteData) {
    return []; // Return an empty array if no votes are found
  }

  const monthlyVoteData: IMonthlyVoteData[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 6); // Set to 6 months ago

  // Group votes by month
  for (let i = 0; i < 6; i++) {
    const currentMonth = new Date(startDate);
    currentMonth.setMonth(startDate.getMonth() + i); // Move forward by i months

    const monthVotesCount = voteData.votes.filter((vote) => {
      const voteDate = new Date(vote.createdAt);
      return (
        voteDate.getFullYear() === currentMonth.getFullYear() &&
        voteDate.getMonth() === currentMonth.getMonth()
      );
    }).length;

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };
    const monthString = currentMonth.toLocaleDateString("en-US", options);

    monthlyVoteData.push({
      month: monthString,
      count: monthVotesCount,
    });
  }

  return monthlyVoteData.reverse();
};
