import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import session from "express-session";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import userRoutes from "./routers/user.routes";
import authRoutes from "./routers/auth.routes";
import resumeScanRoutes from "./routers/resumeScan.routes";
import "./config/passport.setup";

const app = express();

dotenv.config();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 2500, // limit each IP to 2500 requests per windowMs
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:1818",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(limiter);
app.set("trust proxy", 1);
app.use(morgan("combined"));
app.use(helmet());

const { SESSION_SECRET } = process.env;

if (!SESSION_SECRET) {
  throw new Error(
    "Missing required environment variables for session initialization"
  );
}

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Ensure cookies are used only over HTTPS in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/v1/resume", resumeScanRoutes);

export { app };
