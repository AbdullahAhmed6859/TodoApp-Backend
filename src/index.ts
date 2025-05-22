import express from "express";
import cors from "cors";
import { initDB } from "./db/initDB";
import morgan from "morgan";
import { authRouter } from "./routers/authRouter";
import { userRouter } from "./routers/userRouter";
import { todoListRouter } from "./routers/todoListRouter";
import { ENV, PORT } from "./config";
import { ok } from "./utils/sendResponse";
import { errorHandler } from "./middleware/errorHandler";

const whitelist = ["http://localhost:5173"];
const corsOptions = {
  // @ts-ignore
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

if (ENV === "DEV") app.use(morgan("dev"));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/lists", todoListRouter);

app.get("/", (req, res) => ok(res, { message: "Welcome to TodoApp API" }));

app.use(errorHandler);

app.listen(3000, async () => {
  if (ENV === "PROD") await initDB();
  if (ENV === "DEV") {
    console.log(`App is running on http://localhost:${PORT}`);
  }
});
