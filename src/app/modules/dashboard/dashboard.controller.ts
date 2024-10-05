import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import User from "../auth/auth.model";
import Post from "../post/post.model";
import Order from "../payment/payment.model";
import { generateLast12MonthData } from "../../utils/generateLast6MonthData";
import { jwtDecode } from "jwt-decode";
import AppError from "../../errors/AppError";
import { JwtPayload } from "jsonwebtoken";
import { dashboardService } from "./dashboard.services";

const getDashboardAnylisis = catchAsync(async (req, res) => {
  const user = await User.estimatedDocumentCount();
  const post = await Post.estimatedDocumentCount();
  const order = await Order.find();
  const revenue = order.reduce((a, i) => a + i.amount, 0);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get most loke post retrive successful!",
    data: { user, post, revenue },
  });
});
const getPostAnylisit = catchAsync(async (req, res) => {
  const result = await generateLast12MonthData(Post);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Post analysis retrive successful!",
    data: result,
  });
});
const getOrderAnylisit = catchAsync(async (req, res) => {
  const result = await generateLast12MonthData(Order as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Post analysis retrive successful!",
    data: result,
  });
});
const getUserDailyAnalytice = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;
  const post = await dashboardService.dailyPostAnalytics(decoded._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Daily analytics data retrive successful!",
    data: post,
  });
});
const getUserWeeklyAnalytice = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;
  const post = await dashboardService.weeklyPostAnalytics(decoded._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Weekly analytics data retrive successful!",
    data: post,
  });
});
const getUserMonthlyAnalytice = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;
  const post = await dashboardService.monthlyPostAnalytics(decoded._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Weekly analytics data retrive successful!",
    data: post,
  });
});

export const dashboardController = {
  getDashboardAnylisis,
  getPostAnylisit,
  getOrderAnylisit,
  getUserDailyAnalytice,
  getUserWeeklyAnalytice,
  getUserMonthlyAnalytice,
};
