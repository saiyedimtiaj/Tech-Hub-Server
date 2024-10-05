import { Model, Types } from "mongoose";

// Helper function to get the week number
const getWeek = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000; // Number of milliseconds in a day
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Helper function to get the Monday and Sunday of the week
const getWeekRange = (week: number, year: number) => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const monday = new Date(simple);
  if (dayOfWeek <= 4) monday.setDate(simple.getDate() - simple.getDay() + 1);
  else monday.setDate(simple.getDate() + 8 - simple.getDay());

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // Sunday is 6 days after Monday

  return { monday, sunday };
};

export const getWeeklyData = async (
  Model: Model<any>,
  matcherId: string,
  idField: string
) => {
  const today = new Date();
  const fiveWeeksAgo = new Date();
  fiveWeeksAgo.setDate(today.getDate() - 34);

  const userPostAnalytics = await Model.aggregate([
    {
      $match: {
        [idField]: new Types.ObjectId(matcherId),
        createdAt: { $gte: fiveWeeksAgo, $lte: today },
      },
    },
    {
      $group: {
        _id: {
          week: { $isoWeek: "$createdAt" },
          year: { $isoWeekYear: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.week": 1 },
    },
  ]);

  const last5Weeks = [];
  for (let i = 0; i < 5; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() - i * 7);

    const weekNumber = getWeek(currentDate);
    const year = currentDate.getFullYear();
    const { monday, sunday } = getWeekRange(weekNumber, year);

    const weekRange = `${(monday.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${monday.getDate().toString().padStart(2, "0")} - ${(
      sunday.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${sunday.getDate().toString().padStart(2, "0")}`;

    last5Weeks.push({
      week: weekRange,
      count: 0, // Default count
      dateKey: `${year}-${weekNumber}`,
    });
  }

  // Map the aggregated results to the same week format
  const formattedAnalytics = userPostAnalytics.map((item) => {
    const { monday, sunday } = getWeekRange(item._id.week, item._id.year);
    const weekRange = `${(monday.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${monday.getDate().toString().padStart(2, "0")} - ${(
      sunday.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${sunday.getDate().toString().padStart(2, "0")}`;

    return {
      week: weekRange,
      count: item.count,
      dateKey: `${item._id.year}-${item._id.week}`, // Unique key for merging
    };
  });

  // Merge the default 5-week array with the aggregated results
  const mergedAnalytics = last5Weeks.map((week) => {
    const foundWeek = formattedAnalytics.find(
      (item) => item.dateKey === week.dateKey
    );
    return {
      week: week.week,
      count: foundWeek ? foundWeek.count : 0, // Use the found count or default to 0
    };
  });
  return mergedAnalytics.reverse();
};
