import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";
import AppError from "../../errors/AppError";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import { paymentServices } from "./payment.services";
import { TOrder } from "./payment.interface";
const stripe = require("stripe")(config.stripe_secret);

const paymentIntent = catchAsync(async (req, res) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "USD",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe intent retrive successful!",
    data: myPayment.client_secret,
  });
});

const createNewOrder = catchAsync(async (req, res) => {
  const body = req.body;
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  const decoded = (await jwtDecode(req.headers.authorization)) as JwtPayload;
  const payload = {
    paymentId: body?.id,
    amount: body?.amount / 100,
    status: body?.status,
    userId: decoded?._id,
  };

  const result = await paymentServices.createPayment(payload as TOrder);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment create successful!",
    data: result,
  });
});

const getAllPayment = catchAsync(async (req, res) => {
  const result = await paymentServices.getAllPayment();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment data retrive successful!",
    data: result,
  });
});

export const paymentController = {
  paymentIntent,
  createNewOrder,
  getAllPayment,
};
