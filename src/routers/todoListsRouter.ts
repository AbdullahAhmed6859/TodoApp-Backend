import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  createMyList,
  deleteMyList,
  getMyLists,
} from "../controllers/todoListsController";

const router = Router();

router.use(protect);

router.get("/", getMyLists);

router.post("/", createMyList);

// router.patch("/:listId");

router.delete("/:id", deleteMyList);

// router.post("/:listId/todos");

export default router;
