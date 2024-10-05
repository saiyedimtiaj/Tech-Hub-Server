import { Model, Types } from "mongoose";

// General function to fetch daily data
export const getDailyData = async (
  Model: Model<any>, // Generic model
  matcherId: string, // The field you want to match, typically a user or related ID
  idField: string
) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 6); // Calculate range start date

  const userPostAnalytics = await Model.aggregate([
    {
      $match: {
        [idField]: new Types.ObjectId(matcherId), // Dynamically match by idField
        createdAt: { $gte: startDate, $lte: today }, // Filter by date range
      },
    },
    {
      $group: {
        _id: {
          dayOfMonth: { $dayOfMonth: `$createdAt` }, // Extract day
          dayOfWeek: { $dayOfWeek: `$createdAt` }, // Extract week day
          month: { $month: `$createdAt` }, // Extract month
          year: { $year: `$createdAt` }, // Extract year
        },
        count: { $sum: 1 }, // Count the occurrences
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.dayOfMonth": 1 }, // Sort by year, month, and day
    },
  ]);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Prepare the last X days (default 7)
  const lastDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    lastDays.push({
      day: dayNames[date.getDay()], // Day name
      dateKey: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, // Unique key for merging
      count: 0, // Default count
    });
  }

  // Format aggregated results
  const formattedAnalytics = userPostAnalytics.map((item) => {
    const dayOfWeek = dayNames[item._id.dayOfWeek - 1];
    const dateKey = `${item._id.year}-${item._id.month}-${item._id.dayOfMonth}`;

    return {
      day: dayOfWeek,
      dateKey,
      count: item.count,
    };
  });

  // Merge the last X days with the actual data
  const mergedAnalytics = lastDays.map((day) => {
    const foundDay = formattedAnalytics.find(
      (item) => item.dateKey === day.dateKey
    );
    return {
      day: day.day,
      count: foundDay ? foundDay.count : 0, // If found, use the count; otherwise, 0
    };
  });

  return mergedAnalytics.reverse(); // Reverse to show the latest day first
};
