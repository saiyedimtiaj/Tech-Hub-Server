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

const getUserAllPost = catchAsync(async (req, res) => {
  const result = await postServices.getMyPosts(req?.params?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrive successful!",
    data: result,
  });
});

const getAllPost = catchAsync(async (req, res) => {
  const { limit, sort } = req.query;
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;

  const result = await postServices.getAllPosts(
    limit as string,
    decoded._id,
    sort as "asc" | "desc" | undefined
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrive successful!",
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await postServices.getSinglePost(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single Post retrive successful!",
    data: result,
  });
});
const getMostLikedPost = catchAsync(async (req, res) => {
  const result = await postServices.getMostLikedPosts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get most loke post retrive successful!",
    data: result,
  });
});
const deletePost = catchAsync(async (req, res) => {
  const result = await postServices.deletePost(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post delete successful!",
    data: result,
  });
});

const searchPost = catchAsync(async (req, res) => {
  if (!req?.query?.searchTrams) {
    throw new AppError(httpStatus.BAD_REQUEST, "Search trams mandatory");
  }
  const result = await postServices.getSearchedPost(
    req.query?.searchTrams as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Search post successful!",
    data: result,
  });
});

export const postController = {
  createPost,
  getMyAllPost,
  getAllPost,
  getSinglePost,
  getUserAllPost,
  getMostLikedPost,
  deletePost,
  searchPost,
};
