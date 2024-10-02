import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { postRoute } from "../modules/post/post.route";
import { commentRoute } from "../modules/comments/comment.route";
import { voteRoute } from "../modules/vote/vote.route";
import { paymentRoute } from "../modules/payment/payment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },
  {
    path: "/comment",
    route: commentRoute,
  },
  {
    path: "/vote",
    route: voteRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
