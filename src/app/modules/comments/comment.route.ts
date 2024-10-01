import { Router } from "express";
import { commentController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.interface";

const route = Router();

route.post(
  "/create-comment",
  auth(USER_ROLE.user),
  commentController.createComment
);

route.get("/get-coment/:id", commentController.getComments);

export const commentRoute = route;
