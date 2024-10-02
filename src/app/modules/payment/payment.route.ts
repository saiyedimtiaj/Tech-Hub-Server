import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.interface";

const router = Router();

router.post("/create-payment-intent", paymentController.paymentIntent);
router.post(
  "/mambership",
  auth(USER_ROLE.user),
  paymentController.createNewOrder
);

router.get(
  "/payment-info",
  auth(USER_ROLE.admin),
  paymentController.getAllPayment
);

export const paymentRoute = router;
