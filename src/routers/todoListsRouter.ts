import { Router } from "express";
import { protect } from "../middleware/auth";
import { createList, getMyLists } from "../controllers/todoListsController";

const router = Router();

router.use(protect);

router.get("/", getMyLists);

router.post("/", createList);

// router.patch("/:listId");

// router.delete("/:listId");

// router.post("/:listId/todos");

export default router;
