import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import config from "../../config";
import AppError from "../../errors/AppError";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import UAParser from "ua-parser-js";
import requestIp from "request-ip";
import User from "./auth.model";

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

const ChangePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: "Password change sucessful!",
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

const getUserInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await authService.getUserProfile(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update user info successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await authService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "users retrive successfully!",
    data: result,
  });
});
const LogOut = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;

  const result = await User.findByIdAndUpdate(
    decoded?._id,
    { isLoggedIn: false },
    {
      new: true,
      runValidators: true,
    }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "users log out successfully!",
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await authService.changedUserStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "users status successfully!",
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
  getUserInfo,
  getAllUsers,
  changeUserStatus,
  ChangePassword,
  LogOut,
};
