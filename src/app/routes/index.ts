import { Router } from "express";
import { courseRoute } from "../modules/course/course.route";
import { authRoute } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
