import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.interface";

const route = Router();

route.post("/create-post", auth(USER_ROLE.user), postController.createPost);
route.get(
  "/my-posts",
  auth(USER_ROLE.user, USER_ROLE.admin),
  postController.getMyAllPost
);

export const postRoute = route;
