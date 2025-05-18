import { Router } from "express";
import { protect } from "../middleware/auth";
import { getMe, getUser } from "../controllers/userController";

const router = Router();

router.get("/me", protect, getMe, getUser);

export default router;
