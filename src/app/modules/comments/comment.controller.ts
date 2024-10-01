import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { jwtDecode } from "jwt-decode";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { commentServices } from "./comment.services";

const createComment = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;

  const result = await commentServices.createComment(decoded?._id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create Comment successful!",
    data: result,
  });
});

const getComments = catchAsync(async (req, res) => {
  const result = await commentServices.getAllComment(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment retrive successful!",
    data: result,
  });
});

export const commentController = {
  createComment,
  getComments,
};
