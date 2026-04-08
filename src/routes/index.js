import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { authRouter } from "./auth.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userRouter } from "../modules/users/user.routes.js";


const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);

router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export { router };
