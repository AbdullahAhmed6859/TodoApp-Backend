import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "DEV";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello World",
  });
});

app.listen(3000, () => {
  if (ENV === "DEV") console.log(`App is running on http://localhost:${PORT}`);
});
