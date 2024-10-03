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

route.get(
  "/all-posts",
  auth(USER_ROLE.admin, USER_ROLE.user),
  postController.getAllPost
);
route.get("/most-liked", postController.getMostLikedPost);
route.get("/get-post/:id", postController.getSinglePost);
route.delete(
  "/delete/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  postController.deletePost
);

route.get("/search", postController.searchPost);

export const postRoute = route;
