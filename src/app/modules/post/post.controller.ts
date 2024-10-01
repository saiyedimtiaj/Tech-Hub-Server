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

  const { data } = req.body;
  const parsedData = JSON.parse(data); // Parse the incoming post data
  const imageFiles = req.files as Express.Multer.File[]; // Images from multer

  // Prepare the image URLs from Cloudinary
  const images = imageFiles.map((file) => file.path);

  const postData = { ...parsedData, images, userId: decoded?._id };

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

  const result = await postServices.getMyPosts(decoded?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrive successful!",
    data: result,
  });
});
const getAllPost = catchAsync(async (req, res) => {
  const result = await postServices.getAllPosts();

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
  getAllPost,
};
