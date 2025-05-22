import express from "express";
import { signUp, logIn, testProtect } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/testprotect", protect, testProtect);

export { router as authRouter };
