import {
  getTodoListsForUser,
  createTodoListForUser,
  deleteTodoListForUser,
  updateTodoListForUser,
  todoListBelongsToUser,
} from "../models/todoListsModel";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { created, deleted, ok } from "../utils/sendResponse";
import { idParams } from "../zod-schemas/common";
import {
  createListSchema,
  updateListSchema,
} from "../zod-schemas/todoListSchemas";

export const getMyLists = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;

  const todoLists = await getTodoListsForUser(userId);
  return ok(res, {
    data: { todoLists },
    message: "Let's Create Your First Todo List",
  });
});

export const createMyList = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const data = createListSchema.parse(req.body);

  const newList = await createTodoListForUser(userId, data);

  return created(res, {
    data: { newList },
    message: "TodoList has been created",
  });
});

export const updateMyList = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { id: listId } = idParams.parse(req.params);
  const data = updateListSchema.parse(req.body);

  if (await todoListBelongsToUser(userId, listId)) {
    AppError.forbidden("You donot have permission to access this todo list");
  }

  const updatedList = await updateTodoListForUser(userId, listId, data);

  return ok(res, {
    data: {
      updatedList,
    },
  });
});

export const deleteMyList = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const { id: listId } = idParams.parse(req.params);

  if (await todoListBelongsToUser(userId, listId)) {
    AppError.forbidden("You donot have permission to access this todo list");
  }

  await deleteTodoListForUser(userId, listId);

  return deleted(res);
});
