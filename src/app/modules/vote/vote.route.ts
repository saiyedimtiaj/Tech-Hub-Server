import { Router } from "express";
import { voteController } from "./vote.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.interface";

const route = Router();

route.post("/vote", auth(USER_ROLE.user), voteController.addOrRemoveVotes);
route.get("/all-votes/:id", voteController.getAllVotes);

export const voteRoute = route;
