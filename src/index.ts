import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { initDB } from "./db/initDB";
import { seedDB } from "./db/seed";

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

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello World",
  });
});

app.listen(3000, async () => {
  await initDB();
  if (ENV === "DEV") {
    await seedDB();
    console.log(`App is running on http://localhost:${PORT}`);
  }
});
