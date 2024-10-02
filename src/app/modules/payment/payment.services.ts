import mongoose from "mongoose";
import User from "../auth/auth.model";
import { TOrder } from "./payment.interface";
import Order from "./payment.model";

const createPayment = async (payload: TOrder) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const nowDate = new Date();
    const membershipEnd = new Date(nowDate);
    membershipEnd.setDate(nowDate.getDate() + 30);

    let user = await User.findById(payload?.userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }

    user.membership = true;
    user.membershipEnd = membershipEnd;
    await user.save({ session });

    const order = await Order.create([{ ...payload, membershipEnd }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllPayment = async () => {
  const result = await Order.find().populate("userId");
  return result;
};

export const paymentServices = {
  createPayment,
  getAllPayment,
};
