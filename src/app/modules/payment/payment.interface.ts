import { Schema } from "mongoose";

export interface TOrder extends Document {
  paymentId: string;
  amount: number;
  status: string;
  userId: Schema.Types.ObjectId;
}
