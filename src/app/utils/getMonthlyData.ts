import { Model, Types } from "mongoose";

export const getMonthlyData = async (
  Model: Model<any>,
  matcherId: string,
  idField: string
) => {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6); // Set date to 6 months ago

  // Aggregation to get posts created in the last 6 months
  const userPostAnalytics = await Model.aggregate([
    {
      // Match posts created by the user in the last 6 months
      $match: {
        [idField]: new Types.ObjectId(matcherId),
        createdAt: { $gte: sixMonthsAgo, $lte: today }, // Filter posts created within the last 6 months
      },
    },
    {
      // Group posts by month and year
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 }, // Count the number of posts per month
      },
    },
    {
      // Sort by year and month in ascending order
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Create an array for the last 6 months with zero counts
  const last6Months = [];
  for (let i = 0; i < 6; i++) {
    const currentDate = new Date();
    currentDate.setMonth(today.getMonth() - i); // Subtract by month intervals

    // Get the full month name
    const monthName = currentDate.toLocaleString("default", {
      month: "long",
    });

    last6Months.push({
      month: monthName, // Use the full month name
      count: 0, // Default count
      dateKey: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`, // Unique key for merging
    });
  }

  // Map the aggregated results to the same month format
  const formattedAnalytics = userPostAnalytics.map((item) => {
    // Get the full month name
    const monthName = new Date(
      item._id.year,
      item._id.month - 1
    ).toLocaleString("default", {
      month: "long",
    });

    return {
      month: monthName, // Use the full month name
      count: item.count,
      dateKey: `${item._id.year}-${item._id.month}`, // Unique key for merging
    };
  });

  // Merge the default 6-month array with the aggregated results
  const mergedAnalytics = last6Months.map((month) => {
    const foundMonth = formattedAnalytics.find(
      (item) => item.dateKey === month.dateKey
    );
    return {
      month: month.month,
      count: foundMonth ? foundMonth.count : 0, // Use the found count or default to 0
    };
  });

  return mergedAnalytics.reverse();
};
