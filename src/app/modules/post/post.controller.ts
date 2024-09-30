import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { jwtDecode } from "jwt-decode";
import AppError from "../../errors/AppError";
import { JwtPayload } from "jsonwebtoken";
import { postServices } from "./post.services";

const createPost = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;
  const postData = { ...req.body, userId: decoded._id };

  console.log(postData);

  const result = await postServices.createPost(postData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post create successfully!",
    data: result,
  });
});

const getMyAllPost = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;

  console.log(decoded);

  const result = await postServices.getMyPosts(decoded?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrive successful!",
    data: result,
  });
});

export const postController = {
  createPost,
  getMyAllPost,
};
