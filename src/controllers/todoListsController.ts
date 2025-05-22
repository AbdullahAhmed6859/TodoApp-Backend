import {
  getTodoListsForUser,
  createTodoListForUser,
  deleteTodoListForUser,
  updateTodoListForUser,
} from "../models/todoListsModel";
import { catchAsync } from "../utils/catchAsync";
import {
  conflict,
  created,
  deleted,
  notFound,
  ok,
  zodBadRequest,
} from "../utils/sendResponse";
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
  const result = createListSchema.safeParse(req.body);
  if (!result.success) {
    return zodBadRequest(res, result);
  }

  const newList = await createTodoListForUser(userId, result.data);
  if (!newList) {
    return conflict(res, "List could not be created");
  }
  return created(res, { data: { newList }, message: "TodoList created" });
});

export const updateMyList = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;

  const paramsResult = idParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodBadRequest(res, paramsResult);
  }

  const bodyResult = updateListSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodBadRequest(res, bodyResult);
  }
  const { id: listId } = paramsResult.data;

  const updatedList = await updateTodoListForUser(
    userId,
    listId,
    bodyResult.data
  );

  if (!updatedList) {
    return notFound(res, { message: "List not found" });
  }

  return ok(res, {
    data: {
      updatedList,
    },
  });
});

export const deleteMyList = catchAsync(async (req, res, next) => {
  const userId = req.userId as number;
  const result = idParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }
  const { id: listId } = result.data;

  const deletedList = await deleteTodoListForUser(userId, listId);
  if (!deletedList) {
    return notFound(res, { message: "List not found" });
  }

  return deleted(res);
});
