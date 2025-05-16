import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { initDB } from "./db/initDB";
import userRouter from "./routers/userRouter";
import todoRouter from "./routers/todoRouter";
import todoListRouter from "./routers/todoListRouter";

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "DEV";

const app = express();
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

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/lists", todoListRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello World",
  });
});

app.listen(3000, async () => {
  await initDB();
  if (ENV === "DEV") {
    console.log(`App is running on http://localhost:${PORT}`);
  }
});
