import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import rateLimit from "express-rate-limit";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many HTTP requests, try again later' },
  standardHeaders: true,
  legacyHeaders: true
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // apenas 10 tentativas de login a cada 15 minutos
  message: { error: 'Too many login attempts, please try again later.' }
})

app.use('/api/users/login', authLimiter)
app.use(limiter);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.use("/api", router);

export { app };
