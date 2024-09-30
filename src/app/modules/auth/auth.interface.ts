import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile?: string;
  role: string;
  bio?: string;
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
