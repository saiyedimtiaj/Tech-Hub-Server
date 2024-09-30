import { Router } from "express";
import { voteController } from "./vote.controller";

const route = Router();

route.post("/vote", voteController.addOrRemoveVotes);

export const voteRoute = route;
