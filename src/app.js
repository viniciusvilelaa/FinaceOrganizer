import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin,
    credentials: true,
  }),
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
