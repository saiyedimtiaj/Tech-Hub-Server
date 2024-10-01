import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import config from "../../config";
import AppError from "../../errors/AppError";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req, res) => {
  const result = await authService.createUser(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: {
      accessToken,
      refreshToken,
    },
    success: true,
    message: "Create user sucessful!",
  });
});

const logInuser = catchAsync(async (req, res) => {
  const result = await authService.logIn(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: {
      accessToken,
      refreshToken,
    },
    success: true,
    message: "User logged in sucessful!",
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await authService.updateUser(req.body, req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update user info successfully!",
    data: result,
  });
});

const getUserProfile = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;

  const result = await authService.getUserProfile(decoded?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update user info successfully!",
    data: result,
  });
});

const followRequest = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;

  const result = await authService.followRequest(decoded?._id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow successful!",
    data: result,
  });
});

const displayFollowingRequest = catchAsync(async (req, res) => {
  let userId;
  if (req.headers.authorization) {
    const decoded = (await jwtDecode(
      req?.headers?.authorization as string
    )) as JwtPayload;
    userId = decoded?._id;
  }

  const result = await authService.displayFollowingRequestService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "People may i know users get successful!",
    data: result,
  });
});

export const authController = {
  createUser,
  logInuser,
  refreshToken,
  updateUser,
  getUserProfile,
  followRequest,
  displayFollowingRequest,
};
