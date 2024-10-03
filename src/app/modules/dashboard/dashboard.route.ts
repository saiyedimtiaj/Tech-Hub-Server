import { dashboardController } from "./dashboard.controller";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.interface";

const route = Router();

route.get(
  "/analytics",
  auth(USER_ROLE.admin),
  dashboardController.getDashboardAnylisis
);
route.get(
  "/order-analytics",
  auth(USER_ROLE.admin),
  dashboardController.getOrderAnylisit
);
route.get(
  "/post-analytics",
  auth(USER_ROLE.admin),
  dashboardController.getPostAnylisit
);

export const dashboardRoute = route;
