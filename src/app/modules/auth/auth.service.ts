import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser, TLogIn } from "./auth.interface";
import User from "./auth.model";
import bcrypt from "bcrypt";
import { createToken } from "../../utils/verifyJwt";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { startSession, Types } from "mongoose";
import Post from "../post/post.model";

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
    bio: newUser?.bio as string,
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
    bio: isUserExist?.bio as string,
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
    bio: user?.bio as string,
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

const updateUser = async (user: Partial<IUser>, id: string) => {
  const { name, profile, bio } = user;
  const newUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      profile,
      bio,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return newUser;
};

const getUserProfile = async (id: string) => {
  const result = await User.findById(id).exec();
  const postCount = (await Post.find({ userId: new Types.ObjectId(id) }))
    .length;
  return { ...result?.toObject(), postCount };
};

const followRequest = async (userId: string, body: { followId: string }) => {
  const session = await startSession();
  session.startTransaction();
  try {
    // Find the user who is initiating the follow request
    const user = await User.findById(userId).session(session);
    const followingUser = await User.findById(body?.followId).session(session);

    if (!user || !followingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if the user is already following
    const isAlreadyFollowing = user.following.some(
      (follower) => follower.userId.toString() === body.followId
    );
    if (isAlreadyFollowing) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are already following this user"
      );
    }

    // Update the 'following' field for the user initiating the follow request
    user.following.push({ userId: new Types.ObjectId(body.followId) });

    // Update the 'followers' field for the user being followed
    followingUser.followers.push({ userId: new Types.ObjectId(userId) });

    // Save the updates within the same transaction
    await user.save({ session });
    await followingUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { user, followingUser };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Follow request failed"
    );
  }
};

const displayFollowingRequestService = async (userId?: string) => {
  let result;

  if (!userId) {
    result = await User.find({}).sort({ createdAt: -1 }).limit(5).lean();
  } else {
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    const followingUserIds = user.following.map((f) => f.userId);

    result = await User.find({
      _id: {
        $nin: [
          ...followingUserIds.map((id) => new Types.ObjectId(id)),
          new Types.ObjectId(userId),
        ],
      },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  }

  return result;
};

export const authService = {
  createUser,
  logIn,
  refreshToken,
  updateUser,
  getUserProfile,
  followRequest,
  displayFollowingRequestService,
};
