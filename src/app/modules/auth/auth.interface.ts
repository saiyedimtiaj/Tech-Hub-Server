import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile?: string;
  role: string;
  bio?: string;
  followers: { userId: Types.ObjectId }[];
  following: { userId: Types.ObjectId }[];
  membership: boolean; // Corrected spelling
  membershipEnd?: Date;
  status: string;
  lastLogin: Date;
  isLoggedIn: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type TLogIn = {
  email: string;
  password: string;
};

export const USER_ROLE = {
  admin: "admin",
  user: "user",
} as const;
