import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  getMyId,
  getUser,
  patchUpdateUser,
} from "../controllers/userController";

const router = Router();
router.use(protect);
router.route("/me").all(getMyId).get(getUser).patch(patchUpdateUser);
export { router as userRouter };
