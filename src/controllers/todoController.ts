import { TodoService } from "../services/todo.service";
import { catchAsync } from "../utils/catchAsync";
import { created, deleted, ok } from "../utils/sendResponse";
import { listIdParams } from "../zod-schemas/todoListSchemas";
import {
  createTodoSchema,
  patchUpdateTodoSchema,
  todoIdParams,
} from "../zod-schemas/todoSchema";

export const getMyTodos = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId } = listIdParams.parse(req.params);

  const todos = await TodoService.getAll(userId, listId);

  return ok(res, {
    data: {
      todos,
    },
  });
});

export const createMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId } = listIdParams.parse(req.params);
  const data = createTodoSchema.parse(req.body);

  const newTodo = await TodoService.create(userId, listId, data);

  return created(res, {
    data: {
      newTodo,
    },
    message: "Todo has been created",
  });
});

export const updateMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId, todoId } = todoIdParams.parse(req.params);
  const data = patchUpdateTodoSchema.parse(req.body);

  const updatedTodo = await TodoService.update(userId, listId, todoId, data);

  return ok(res, {
    data: {
      updatedTodo,
    },
  });
});

export const deleteMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId, todoId } = todoIdParams.parse(req.params);

  await TodoService.delete(userId, listId, todoId);

  return deleted(res);
});
