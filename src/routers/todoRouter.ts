import { Router } from "express";
import {
  createMyTodo,
  deleteMyTodo,
  getMyTodos,
  patchUpdateMyTodo,
  putUpdateMyTodo,
} from "../controllers/todoController";
import { protect } from "../middleware/auth";

const router = Router();
router.use(protect);

router.get("/", getMyTodos);
router
  .route("/:todoId")
  .post(createMyTodo)
  .put(putUpdateMyTodo)
  .patch(patchUpdateMyTodo)
  .delete(deleteMyTodo);

export default router;
