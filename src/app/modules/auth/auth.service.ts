import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser, TLogIn } from "./auth.interface";
import User from "./auth.model";
import bcrypt from "bcrypt";
import { createToken } from "../../utils/verifyJwt";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const createUser = async (user: IUser) => {
  const isUserExist = await User.findOne({ email: user?.email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist!");
  }

  const newUser = await User.create(user);

  const jwtPayload = {
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    profile: newUser?.profile,
    _id: newUser?._id as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const logIn = async (user: TLogIn) => {
  const isUserExist = await User.findOne({ email: user?.email }).select(
    "+password"
  );

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found!");
  }

  const isPasswordCorrect = await bcrypt.compare(
    user.password,
    isUserExist.password
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password!");
  }

  const jwtPayload = {
    name: isUserExist.name,
    email: isUserExist.email,
    role: isUserExist.role,
    profile: isUserExist?.profile,
    _id: isUserExist?._id as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  const jwtPayload = {
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user?.profile,
    _id: user?._id as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

export const authService = {
  createUser,
  logIn,
  refreshToken,
};
