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
router.use("/:listId", todoRouter);

router.use(protect);
router.route("/").get(getMyLists).post(createMyList);
router.route("/:listId").put(updateMyList).delete(deleteMyList);

export { router as todoListRouter };
