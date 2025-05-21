import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  getMyId,
  getUser,
  patchUpdateUser,
  putUpdateUser,
} from "../controllers/userController";

const router = Router();
router.use(protect);
router
  .route("/me")
  .all(getMyId)
  .get(getUser)
  .put(putUpdateUser)
  .patch(patchUpdateUser);
// .delete()
export default router;
