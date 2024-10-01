import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { jwtDecode } from "jwt-decode";
import sendResponse from "../../utils/sendResponse";
import { voteServices } from "./vote.services";
import { JwtPayload } from "jsonwebtoken";

const addOrRemoveVotes = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;

  const result = await voteServices.addOrRemoveVote(
    decoded?._id,
    req.body.postId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote create or remove successful!",
    data: result,
  });
});

const getAllVotes = catchAsync(async (req, res) => {
  const result = await voteServices.getAllVote(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get all vote successful!",
    data: result,
  });
});

export const voteController = {
  addOrRemoveVotes,
  getAllVotes,
};
