import { Router } from "express";
import {
  createMyTodo,
  deleteMyTodo,
  getMyTodos,
  patchUpdateMyTodo,
  putUpdateMyTodo,
} from "../controllers/todoController";

const router = Router({ mergeParams: true });

router.route("/").get(getMyTodos).post(createMyTodo);

router
  .route("/:todoId")
  .put(putUpdateMyTodo)
  .patch(patchUpdateMyTodo)
  .delete(deleteMyTodo);

export { router as todoRouter };
