import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import config from "../../config";

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

export const authController = {
  createUser,
  logInuser,
  refreshToken,
};
