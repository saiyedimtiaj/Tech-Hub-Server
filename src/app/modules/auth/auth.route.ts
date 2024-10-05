import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./auth.interface";

const route = Router();

route.post("/create-user", authController.createUser);
route.post("/login", authController.logInuser);
route.post("/change-password", authController.ChangePassword);
route.post("/refresh-token", authController.refreshToken);
route.put(
  "/update-user/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  authController.updateUser
);

route.get(
  "/user-profile",
  auth(USER_ROLE.admin, USER_ROLE.user),
  authController.getUserProfile
);

route.patch(
  "/follow",
  auth(USER_ROLE.admin, USER_ROLE.user),
  authController.followRequest
);

route.get("/know-users", authController.displayFollowingRequest);

route.get("/user-info/:id", authController.getUserInfo);
route.get("/users", auth(USER_ROLE.admin), authController.getAllUsers);
route.put(
  "/status-change/:id",
  auth(USER_ROLE.admin),
  authController.changeUserStatus
);

route.post(
  "/logout",
  auth(USER_ROLE.admin, USER_ROLE.user),
  authController.LogOut
);

export const authRoute = route;
