import { Router } from "express";
import {
  createMyTodo,
  deleteMyTodo,
  getMyTodos,
  updateMyTodo,
} from "../controllers/todoController";

const router = Router({ mergeParams: true });

router.route("/").get(getMyTodos).post(createMyTodo);

router
  .route("/:todoId")
  .patch(updateMyTodo)
  .delete(deleteMyTodo);

export { router as todoRouter };
