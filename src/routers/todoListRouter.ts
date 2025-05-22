import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  createMyList,
  deleteMyList,
  getMyLists,
  updateMyList,
} from "../controllers/todoListsController";
import { todoRouter } from "./todoRouter";

const router = Router();
router.use(protect);
router.use("/:listId/todos", todoRouter);

router.route("/").get(getMyLists).post(createMyList);
router.route("/:listId").put(updateMyList).delete(deleteMyList);

export { router as todoListRouter };
