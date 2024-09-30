import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./auth.interface";

const route = Router();

route.post("/create-user", authController.createUser);
route.post("/login", authController.logInuser);
route.post("/refresh-token", authController.refreshToken);
route.put(
  "/update-user/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  authController.updateUser
);

export const authRoute = route;
