import { Router } from "express";
import { protect } from "../middleware/auth";
import { getMyId, getUser, updateUser } from "../controllers/userController";

const router = Router();
router.use(protect);
router.route("/me").all(getMyId).get(getUser).put(updateUser);
export default router;
