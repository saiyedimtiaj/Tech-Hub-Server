import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.interface";
import { multerUpload } from "../../config/multer.config";

const route = Router();

route.post(
  "/create-post",
  multerUpload.array("image", 8),
  auth(USER_ROLE.user),
  postController.createPost
);
route.get(
  "/my-posts",
  auth(USER_ROLE.user, USER_ROLE.admin),
  postController.getMyAllPost
);
route.get("/user-posts/:id", postController.getUserAllPost);

route.get("/all-posts", postController.getAllPost);
route.get("/get-post/:id", postController.getSinglePost);

export const postRoute = route;
