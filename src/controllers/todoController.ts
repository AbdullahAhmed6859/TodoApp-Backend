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
  zodBadRequest,
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

  const resultParams = listIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const { listId } = resultParams.data;

  const todos = await getTodosOfAList(userId, listId);
  return ok(res, {
    data: {
      todos,
    },
  });
});

export const createMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;

  const resultParams = listIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const resultBody = createTodoSchema.safeParse(req.body);
  if (!resultBody.success) {
    return zodBadRequest(res, resultBody);
  }

  const { listId } = resultParams.data;
  const newTodo = await createTodoForAList(userId, listId, resultBody.data);

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

  const resultParams = todoIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const resultBody = putUpdateTodoSchema.safeParse(req.body);
  if (!resultBody.success) {
    return zodBadRequest(res, resultBody);
  }

  const { listId, todoId } = resultParams.data;
  const updatedTodo = await putUpdateTodoOfAList(
    userId,
    listId,
    todoId,
    resultBody.data
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

export const patchUpdateMyTodo = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;

  const resultParams = todoIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const resultBody = patchUpdateTodoSchema.safeParse(req.body);
  if (!resultBody.success) {
    return zodBadRequest(res, resultBody);
  }

  const { listId, todoId } = resultParams.data;

  const updatedTodo = await patchUpdateTodoOfAList(
    userId,
    listId,
    todoId,
    resultBody.data
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
  const resultParams = todoIdParams.safeParse(req.params);

  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const { listId, todoId } = resultParams.data;

  const deletedTodo = await deleteTodoOfAList(userId, listId, todoId);
  if (!deletedTodo) {
    return notFound(res, { message: "Todo not found" });
  }

  return deleted(res);
});
