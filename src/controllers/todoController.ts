import { todoListBelongsToUser } from "../models/todoListsModel";
import {
  createTodoForAList,
  deleteTodoOfAList,
  getTodosOfAList,
  patchUpdateTodoOfAList,
  putUpdateTodoOfAList,
} from "../models/todoModel";
import { catchAsync } from "../utils/catchAsync";
import { created, deleted, ok } from "../utils/sendResponse";
import { listIdParams } from "../zod-schemas/todoListSchemas";
import {
  createTodoSchema,
  patchUpdateTodoSchema,
  putUpdateTodoSchema,
  todoIdParams,
} from "../zod-schemas/todoSchema";

export const getMyTodos = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId } = listIdParams.parse(req.params);

  const todos = await getTodosOfAList(userId, listId);

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

  const newTodo = await createTodoForAList(userId, listId, data);

  return created(res, {
    data: {
      newTodo,
    },
  });
});

export const putUpdateMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId, todoId } = todoIdParams.parse(req.params);
  const data = putUpdateTodoSchema.parse(req.body);

  const updatedTodo = await putUpdateTodoOfAList(userId, listId, todoId, data);

  return ok(res, {
    data: {
      updatedTodo,
    },
  });
});

export const patchUpdateMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId, todoId } = todoIdParams.parse(req.params);
  const data = patchUpdateTodoSchema.parse(req.body);

  const updatedTodo = await patchUpdateTodoOfAList(
    userId,
    listId,
    todoId,
    data
  );

  return ok(res, {
    data: {
      updatedTodo,
    },
  });
});

export const deleteMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId, todoId } = todoIdParams.parse(req.params);

  await deleteTodoOfAList(userId, listId, todoId);

  return deleted(res);
});
