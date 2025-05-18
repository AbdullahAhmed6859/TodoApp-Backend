import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const ENV = process.env.ENV || "DEV";
export const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";
export const DATABASE_URL = process.env.DATABASE_URL || "NO_URL_PROVIDED";
