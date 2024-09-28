import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

route.post("/create-user", authController.createUser);
route.post("/login", authController.logInuser);
route.post("/refresh-token", authController.refreshToken);

export const authRoute = route;
