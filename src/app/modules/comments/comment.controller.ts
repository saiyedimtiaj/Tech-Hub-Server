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

  console.log(decoded);

  const result = await commentServices.createComment(decoded?._id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post Comment successful!",
    data: result,
  });
});

export const commentController = {
  createComment,
};
