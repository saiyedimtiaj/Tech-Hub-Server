import { Schema, model, Types } from "mongoose";
import { TOrder } from "./payment.interface";

const orderSchema = new Schema<TOrder>(
  {
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User", // Reference to User collection
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model
const Order = model<TOrder>("Order", orderSchema);

export default Order;
