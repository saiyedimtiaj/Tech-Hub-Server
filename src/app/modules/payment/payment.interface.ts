import { Schema } from "mongoose";

export interface TOrder {
  paymentId: string;
  amount: number;
  status: string;
  userId: Schema.Types.ObjectId;
}
