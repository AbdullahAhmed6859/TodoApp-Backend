import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  createMyList,
  deleteMyList,
  getMyLists,
  updateMyList,
} from "../controllers/todoListsController";

const router = Router();

router.use(protect);
router.route("/").get(getMyLists).post(createMyList);
router.route("/:id").put(updateMyList).delete(deleteMyList);

// router.post("/:listId/todos");

export default router;
