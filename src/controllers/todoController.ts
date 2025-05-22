import {
  createTodoForAList,
  deleteTodoOfAList,
  getTodosOfAList,
  patchUpdateTodoOfAList,
  putUpdateTodoOfAList,
} from "../models/todoModel";
import { catchAsync } from "../utils/catchAsync";
import {
  conflict,
  created,
  deleted,
  notFound,
  ok,
} from "../utils/sendResponse";
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

  if (!newTodo) {
    return conflict(res, "Todo Could not be created");
  }

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
  if (!updatedTodo) {
    return notFound(res);
  }

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

  if (!updatedTodo) {
    return notFound(res);
  }

  return ok(res, {
    data: {
      updatedTodo,
    },
  });
});

export const deleteMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { listId, todoId } = todoIdParams.parse(req.params);

  const deletedTodo = await deleteTodoOfAList(userId, listId, todoId);
  if (!deletedTodo) {
    return notFound(res, { message: "Todo not found" });
  }

  return deleted(res);
});
