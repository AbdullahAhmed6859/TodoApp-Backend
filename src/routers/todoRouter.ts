import { Router } from "express";
import {
  createMyTodo,
  deleteMyTodo,
  getMyTodos,
  patchUpdateMyTodo,
  putUpdateMyTodo,
} from "../controllers/todoController";

const router = Router();

router.get("/", getMyTodos);
router
  .route("/:todoId")
  .post(createMyTodo)
  .put(putUpdateMyTodo)
  .patch(patchUpdateMyTodo)
  .delete(deleteMyTodo);

export { router as todoRouter };
